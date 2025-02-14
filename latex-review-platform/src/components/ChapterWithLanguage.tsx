'use client';

import { FC, useEffect, useState } from 'react';
import { useLanguage } from '@/app/i18n/LanguageContext';
import ChapterContent from './ChapterContent';
import Comments from './Comments';

interface ChapterWithLanguageProps {
  initialChapter: {
    id: string;
    title: string;
    content: string;
  };
}

const ChapterWithLanguage: FC<ChapterWithLanguageProps> = ({ initialChapter }) => {
  const { currentLang } = useLanguage();
  const [chapter, setChapter] = useState(initialChapter);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(`/api/content?chapterId=${initialChapter.id}&lang=${currentLang()}`);
        if (response.ok) {
          const data = await response.json();
          setChapter(data);
        }
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    fetchChapter();
  }, [currentLang, initialChapter.id]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ChapterContent content={chapter.content} chapterId={chapter.id} />
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                {currentLang() === 'zh' ? '评论区' : 'Comments'}
              </h3>
              <Comments chapterId={chapter.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterWithLanguage;
