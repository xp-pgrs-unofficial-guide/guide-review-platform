import fs from 'fs';
import path from 'path';

export interface Chapter {
  id: string;
  title: string;
  filename: string;
  content: string;
  type: 'frontmatter' | 'mainmatter' | 'backmatter';
}

const LATEX_PROJECT_PATH = path.join(process.cwd(), 'src/app/xp_pgrs_unofficial_guide');

export function extractTitle(content: string): string {
  // 尝试从章节内容中提取标题
  const titleMatch = content.match(/\\chapter{([^}]+)}/);
  if (titleMatch) {
    return titleMatch[1];
  }
  
  // 如果没有找到 \chapter 命令，尝试从 section 中提取
  const sectionMatch = content.match(/\\section{([^}]+)}/);
  if (sectionMatch) {
    return sectionMatch[1];
  }

  return '未命名章节';
}

function processInputCommands(content: string, basePath: string): string {
  // Regular expression to match \input commands and handle author references
  const inputRegex = /\\input\{([^}]+)\}/g;
  const authorRefRegex = /\\([A-Za-z]+)\b/g;
  
  // First replace any author references
  content = content.replace(authorRefRegex, (match, name) => {
    if (name === 'Wu' || name === 'Wang' || name === 'Xie') {
      return name; // Just use the name directly
    }
    return match;
  });
  
  return content.replace(inputRegex, (match, filePath) => {
    // Skip empty or invalid paths
    if (!filePath || filePath === '你的tex文件路径') {
      console.warn(`Skipping invalid input path: ${filePath}`);
      return '';
    }

    try {
      // Clean up the file path and handle special cases
      const cleanPath = filePath.trim()
        .replace(/^author-folder\/([^\/]+)$/, 'author-folder/$1/$1') // Add filename if only author given
        .replace(/^author-folder\/([^\/]+)\/$/, 'author-folder/$1/$1'); // Add filename if path ends in slash
      
      // Handle .tex extension
      const fullPath = cleanPath.endsWith('.tex') ? cleanPath : `${cleanPath}.tex`;
      
      // First try relative to the base path
      let absolutePath = path.join(basePath, fullPath);
      
      // If file doesn't exist at relative path, try from project root
      if (!fs.existsSync(absolutePath)) {
        absolutePath = path.join(LATEX_PROJECT_PATH, fullPath);
      }
      
      // If still not found, try some common variations
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

      // Verify file exists before reading
      if (!fs.existsSync(absolutePath)) {
        console.warn(`Input file not found: ${fullPath} (tried multiple variations)`);
        return '';
      }

      // Read and process the included file
      const includedContent = fs.readFileSync(absolutePath, 'utf-8');
      
      // Recursively process any nested inputs using the directory of the included file
      return processInputCommands(includedContent, path.dirname(absolutePath));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Error processing input file: ${filePath} - ${errorMessage}`);
      return '';
    }
  });
}

export function cleanLatexContent(content: string): string {
  // First process any \input commands
  const processedContent = processInputCommands(content, LATEX_PROJECT_PATH);
  
  // Then apply existing cleaning logic
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
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseMainFile(): Chapter[] {
  const mainFilePath = path.join(LATEX_PROJECT_PATH, 'xp_pgrs_unofficial_guide.tex');
  const mainContent = fs.readFileSync(mainFilePath, 'utf-8');
  
  const chapters: Chapter[] = [];
  let currentSection: 'frontmatter' | 'mainmatter' | 'backmatter' = 'frontmatter';
  
  // 首先分割文件内容为行
  const lines = mainContent.split('\n');
  
  // 遍历每一行来确定文档结构
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 忽略注释行
    if (line.startsWith('%')) continue;
    
    // 检查文档结构命令
    if (line.includes('\\mainmatter')) {
      currentSection = 'mainmatter';
    } else if (line.includes('\\backmatter')) {
      currentSection = 'backmatter';
    }
    
    // 检查包含命令
    const includeMatch = line.match(/^\\include{chapters\/([^}]+)}/);
    if (includeMatch) {
      const filename = includeMatch[1];
      const chapterPath = path.join(LATEX_PROJECT_PATH, 'chapters', `${filename}.tex`);
      
      try {
        const content = fs.readFileSync(chapterPath, 'utf-8');
        chapters.push({
          id: filename,
          title: extractTitle(content),
          filename: `${filename}.tex`,
          content: cleanLatexContent(content),
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

export function getChapterById(id: string): Chapter | null {
  const chapters = parseMainFile();
  return chapters.find(chapter => chapter.id === id) || null;
}

export function getAllChapters(): Chapter[] {
  return parseMainFile();
}
