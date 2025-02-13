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
  // Regular expression to match \input commands
  const inputRegex = /\\input\{([^}]+)\}/g;
  
  return content.replace(inputRegex, (match, filePath) => {
    try {
      // Handle .tex extension if not provided
      const fullPath = filePath.endsWith('.tex') ? filePath : `${filePath}.tex`;
      const absolutePath = path.join(basePath, fullPath);
      
      // Read the content of the included file
      const includedContent = fs.readFileSync(absolutePath, 'utf-8');
      
      // Recursively process any nested \input commands
      return processInputCommands(includedContent, path.dirname(absolutePath));
    } catch (error) {
      console.error(`Error processing \input command for file: ${filePath}`);
      return match; // Keep original \input command if there's an error
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
  
  // 提取所有 \include 命令
  const includePattern = /\\include{chapters\/([^}]+)}/g;
  let match;
  
  while ((match = includePattern.exec(mainContent)) !== null) {
    const filename = match[1];
    
    // 检查当前部分
    if (mainContent.slice(0, match.index).includes('\\mainmatter')) {
      currentSection = 'mainmatter';
    } else if (mainContent.slice(0, match.index).includes('\\backmatter')) {
      currentSection = 'backmatter';
    }
    
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
      console.error(`Error reading chapter file: ${filename}.tex`);
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
