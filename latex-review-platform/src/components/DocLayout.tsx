'use client';

import { FC, ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Chapter } from '@/lib/latex-parser';

interface DocLayoutProps {
  children: ReactNode;
  chapters: Chapter[];
}

const DocLayout: FC<DocLayoutProps> = ({ children, chapters }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const sectionTitles = {
    frontmatter: '',
    mainmatter: '正文',
    backmatter: '其他'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">目录</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Homepage link */}
          <div className="p-4 border-b border-gray-200">
            <Link
              href="/"
              className={`block px-2 py-1 text-sm rounded-md ${
                pathname === '/'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              使用说明
            </Link>
          </div>
          {Object.entries(sectionTitles).map(([section, title]) => (
            <div key={section} className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                {title}
              </h3>
              <ul className="space-y-1">
                {chapters
                  .filter(chapter => chapter.type === section)
                  .map(chapter => (
                    <li key={chapter.id}>
                      <Link
                        href={`/chapters/${chapter.id}`}
                        className={`block px-2 py-1 text-sm rounded-md ${
                          pathname === `/chapters/${chapter.id}`
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {chapter.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isSidebarOpen
                      ? 'M4 6h16M4 12h16M4 18h16'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
            <div className="text-xl font-semibold text-gray-800">
              西浦博士生非官方攻略
            </div>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DocLayout;
