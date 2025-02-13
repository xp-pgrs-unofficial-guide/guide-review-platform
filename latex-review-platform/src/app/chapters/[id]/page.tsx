import { FC } from 'react';
import { notFound } from 'next/navigation';
import ChapterContent from '@/components/ChapterContent';
import { getChapterById } from '@/lib/latex-parser';

interface ChapterPageProps {
  params: {
    id: string;
  };
}

const ChapterPage: FC<ChapterPageProps> = ({ params }) => {
  const chapter = getChapterById(params.id);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ChapterContent content={chapter.content} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow sm:rounded-lg divide-y divide-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">评论区</h3>
            <div className="mt-6 space-y-8">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-white">JD</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Jane Doe</p>
                  <p className="text-sm text-gray-500">这部分内容写得很好，但是可以补充一些具体的例子。</p>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500 font-medium">2小时前</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-white">Me</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="border-b border-gray-200 focus-within:border-indigo-600">
                    <textarea
                      rows={3}
                      className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="添加评论..."
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      发表评论
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
