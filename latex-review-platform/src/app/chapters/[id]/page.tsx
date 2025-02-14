'use server';

import { FC } from 'react';
import { notFound } from 'next/navigation';
import ChapterWithLanguage from '@/components/ChapterWithLanguage';

interface ChapterPageProps {
  params: {
    id: string;
  }
}

const ChapterPage: FC<ChapterPageProps> = async ({ params }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content?chapterId=${params.id}&lang=zh`);
  
  if (!response.ok) {
    notFound();
  }

  const chapter = await response.json();

  return <ChapterWithLanguage initialChapter={chapter} />;
};

export default ChapterPage;
