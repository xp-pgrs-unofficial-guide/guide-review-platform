'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';
import 'katex/dist/katex.min.css';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const Markdown = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default.Markdown),
  { ssr: false }
);

interface ChapterContentProps {
  content: string;
  chapterId: string;
}

const ChapterContent: FC<ChapterContentProps> = ({ content }) => {
  // Escape angle brackets in the content
  const escapedContent = content.replace(/<([^>]+)>/g, '\\<$1\\>');
  
  return (
    <div data-color-mode="light">
      <Markdown source={escapedContent} />
    </div>
  );
};

export default ChapterContent;