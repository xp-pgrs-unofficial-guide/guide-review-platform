'use server';

import { FC } from 'react';
import { notFound } from 'next/navigation';
import ChapterWithLanguage from '@/components/ChapterWithLanguage';

interface ChapterPageProps {
  params: Promise<{
    id: string;
  }>
}

const ChapterPage = async ({ params }: ChapterPageProps) => {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content?chapterId=${id}`,
    { cache: 'no-store' }
  );
  
  if (!response.ok) {
    notFound();
  }

  const chapter = await response.json();

  return <ChapterWithLanguage initialChapter={chapter} />;
};

export default ChapterPage;
