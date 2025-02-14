import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LATEX_PROJECT_PATHS = {
  zh: path.join(process.cwd(), 'xp_pgrs_unofficial_guide'),
  en: path.join(process.cwd(), 'xp_pgrs_unofficial_guide_EN')
};

function extractTitle(content: string): string {
  const titleMatch = content.match(/\\chapter{([^}]+)}/);
  if (titleMatch) {
    return titleMatch[1];
  }
  
  const sectionMatch = content.match(/\\section{([^}]+)}/);
  if (sectionMatch) {
    return sectionMatch[1];
  }

  return 'Untitled Chapter';
}

function processInputCommands(content: string, basePath: string, lang: 'zh' | 'en'): string {
  const inputRegex = /\\input\{([^}]+)\}/g;
  const authorRefRegex = /\\([A-Za-z]+)\b/g;
  
  content = content.replace(authorRefRegex, (match, name) => {
    if (name === 'Wu' || name === 'Wang' || name === 'Xie') {
      return name;
    }
    return match;
  });
  
  return content.replace(inputRegex, (match, filePath) => {
    if (!filePath || filePath === '你的tex文件路径') {
      console.warn(`Skipping invalid input path: ${filePath}`);
      return '';
    }

    try {
      const cleanPath = filePath.trim()
        .replace(/^author-folder\/([^\/]+)$/, 'author-folder/$1/$1')
        .replace(/^author-folder\/([^\/]+)\/$/, 'author-folder/$1/$1');
      
      const fullPath = cleanPath.endsWith('.tex') ? cleanPath : `${cleanPath}.tex`;
      let absolutePath = path.join(basePath, fullPath);
      
      if (!fs.existsSync(absolutePath)) {
        absolutePath = path.join(LATEX_PROJECT_PATHS[lang], fullPath);
      }
      
      if (!fs.existsSync(absolutePath)) {
        const variations = [
          path.join(path.dirname(absolutePath), path.basename(filePath), path.basename(filePath) + '.tex'),
          path.join(path.dirname(absolutePath), 'index.tex'),
          path.join(path.dirname(absolutePath), 'main.tex')
        ];
        
        for (const variant of variations) {
          if (fs.existsSync(variant)) {
            absolutePath = variant;
            break;
          }
        }
      }

      if (!fs.existsSync(absolutePath)) {
        console.warn(`Input file not found for language ${lang}: ${fullPath} (tried multiple variations)`);
        return '';
      }

      const includedContent = fs.readFileSync(absolutePath, 'utf-8');
      return processInputCommands(includedContent, path.dirname(absolutePath), lang);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Error processing input file: ${filePath} - ${errorMessage}`);
      return '';
    }
  });
}

function cleanLatexContent(content: string, basePath: string, lang: 'zh' | 'en'): string {
  const processedContent = processInputCommands(content, basePath, lang);
  
  return processedContent
    .replace(/%.*$/gm, '')
    .replace(/\\chapter{([^}]+)}/g, '# $1\n\n')
    .replace(/\\section{([^}]+)}/g, '## $1\n\n')
    .replace(/\\subsection{([^}]+)}/g, '### $1\n\n')
    .replace(/\\textbf{([^}]+)}/g, '**$1**')
    .replace(/\\textit{([^}]+)}/g, '*$1*')
    .replace(/\\href{([^}]+)}{([^}]+)}/g, '[$2]($1)')
    .replace(/\\url{([^}]+)}/g, '[$1]($1)')
    .replace(/\\emph{([^}]+)}/g, '*$1*')
    .replace(/\\item\s+/g, '- ')
    .replace(/\\begin{itemize}/g, '')
    .replace(/\\end{itemize}/g, '\n')
    .replace(/\\begin{enumerate}/g, '')
    .replace(/\\end{enumerate}/g, '\n')
    .replace(/\\\\/, '\n')
    .replace(/\\par\s*/g, '\n\n')
    .replace(/\\textcolor{[^}]+}{([^}]+)}/g, '$1')
    .replace(/\\label{[^}]+}/g, '')  // Remove \label{...} content
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseMainFile(lang: 'zh' | 'en' = 'zh') {
  const mainFilePath = path.join(LATEX_PROJECT_PATHS[lang], `xp_pgrs_unofficial_guide.tex`);
  if (!fs.existsSync(mainFilePath)) {
    console.error(`Main file not found for language ${lang}: ${mainFilePath}`);
    return [];
  }

  const mainContent = fs.readFileSync(mainFilePath, 'utf-8');
  const chapters: Array<{ id: string; title: string; filename: string; content: string; type: string }> = [];
  let currentSection: 'frontmatter' | 'mainmatter' | 'backmatter' = 'frontmatter';
  
  const lines = mainContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('%')) continue;
    
    if (line.includes('\\mainmatter')) {
      currentSection = 'mainmatter';
    } else if (line.includes('\\backmatter')) {
      currentSection = 'backmatter';
    }
    
    const includeMatch = line.match(/^\\include{chapters\/([^}]+)}/);
    if (includeMatch) {
      const filename = includeMatch[1];
      const chapterPath = path.join(LATEX_PROJECT_PATHS[lang], 'chapters', `${filename}.tex`);
      
      try {
        if (!fs.existsSync(chapterPath)) {
          console.warn(`Chapter file not found: ${chapterPath}`);
          continue;
        }

        const content = fs.readFileSync(chapterPath, 'utf-8');
        chapters.push({
          id: filename,
          title: extractTitle(content),
          filename: `${filename}.tex`,
          content: cleanLatexContent(content, path.dirname(chapterPath), lang),
          type: currentSection
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error reading chapter file: ${filename}.tex - ${errorMessage}`);
      }
    }
  }
  
  return chapters;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') || 'en') as 'zh' | 'en';
  const chapterId = searchParams.get('chapterId');

  try {
    const chapters = parseMainFile(lang);
    
    if (chapterId) {
      const chapter = chapters.find(c => c.id === chapterId);
      if (!chapter) {
        console.error(`Chapter not found: ${chapterId} (language: ${lang})`);
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }
      return NextResponse.json(chapter);
    }
    
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error processing content:', error);
    return NextResponse.json({ error: 'Failed to process content' }, { status: 500 });
  }
}
