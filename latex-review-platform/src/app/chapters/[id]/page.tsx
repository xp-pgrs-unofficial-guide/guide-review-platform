import { FC } from 'react';
import { notFound } from 'next/navigation';
import ChapterContent from '@/components/ChapterContent';
import Comments from '@/components/Comments';
import { getChapterById } from '@/lib/latex-parser';

interface ChapterPageProps {
  params: {
    id: string;
  };
}

const ChapterPage: FC<ChapterPageProps> = async ({ params }) => {
  const chapter = await getChapterById(params.id);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ChapterContent content={chapter.content} chapterId={params.id} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">评论区</h3>
            <Comments chapterId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
