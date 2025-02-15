'use server';

import { notFound } from 'next/navigation';
import ChapterWithLanguage from '@/components/ChapterWithLanguage';
import { getApiUrl } from '@/lib/api-utils';

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
    getApiUrl(`content?chapterId=${id}`),
    { 
      cache: 'no-store',
      next: { revalidate: 0 }
    }
  );
  
  if (!response.ok) {
    notFound();
  }

  const chapter = await response.json();

  return <ChapterWithLanguage initialChapter={chapter} />;
};

export default ChapterPage;
