'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chapter } from '@/lib/latex-parser';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface DocLayoutProps {
  children: ReactNode;
  initialChapters: Chapter[];
}

const DocLayout: FC<DocLayoutProps> = ({ children, initialChapters }) => {
  const pathname = usePathname();
  const { currentLang} = useLanguage();
  const [chapters, setChapters] = useState(initialChapters);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/content?lang=${currentLang()}`);
        if (response.ok) {
          const data = await response.json();
          setChapters(data);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchChapters();
  }, [currentLang]);

  const sectionTitles = {
    frontmatter: currentLang() === 'zh' ? '' : '',
    mainmatter: currentLang() === 'zh' ? '' : '',
    backmatter: currentLang() === 'zh' ? '' : ''
  };

  return (
    <div className="flex min-h-screen pt-14">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r fixed left-0 top-14 bottom-0 overflow-y-auto">
        <nav className="p-4">
          <div className="mb-4">
            {/* <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {currentLang() === 'zh' ? '目录' : 'Contents'}
            </h2> */}
            {/* Usage Guide Link */}
            <Link
              href="/"
              className={`block px-4 py-2 rounded-md ${
                pathname === '/'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {currentLang() === 'zh' ? '使用说明' : 'Usage Guide'}
            </Link>
          </div>

          {/* Chapters by Section */}
          {Object.entries(sectionTitles).map(([section, title]) => (
            <div key={section} className="mb-4">
              {title && (
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 px-4">
                  {title}
                </h3>
              )}
              <ul className="space-y-1">
                {chapters
                  .filter(chapter => chapter.type === section)
                  .map(chapter => (
                    <li key={chapter.id}>
                      <Link
                        href={`/chapters/${chapter.id}`}
                        className={`block px-4 py-2 rounded-md ${
                          pathname === `/chapters/${chapter.id}`
                            ? 'bg-gray-100 text-gray-900'
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
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      </div>
    </div>
  );
};

export default DocLayout;
