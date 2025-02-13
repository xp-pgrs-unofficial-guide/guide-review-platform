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
}

const ChapterContent: FC<ChapterContentProps> = ({ content }) => {
  return (
    <div data-color-mode="light">
      <Markdown source={content} />
    </div>
  );
};

export default ChapterContent;
