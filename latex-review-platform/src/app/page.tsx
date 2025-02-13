import { FC } from 'react';
import { getAllChapters } from '@/lib/latex-parser';

const Home: FC = () => {
  const chapters = getAllChapters();
  
  const sectionTitles = {
    frontmatter: '前言部分',
    mainmatter: '主要内容',
    backmatter: '附录部分'
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">LaTeX Review Platform</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            协作文档评审平台
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            在这里，您可以浏览、评论和讨论 LaTeX 文档的内容
          </p>
        </div>

        {Object.entries(sectionTitles).map(([section, title]) => (
          <div key={section} className="mb-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {section === 'mainmatter' ? '核心章节内容' : section === 'frontmatter' ? '前言和目录' : '致谢和更新记录'}
                </p>
              </div>
              <div className="border-t border-gray-200">
                {chapters
                  .filter(chapter => chapter.type === section)
                  .map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                    >
                      <div className="text-sm font-medium text-gray-500">
                        {chapter.id}
                      </div>
                      <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a
                          href={`/chapters/${chapter.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {chapter.title}
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}

        <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            最近更新
          </h3>
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white">JD</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Jane Doe
                </p>
                <p className="text-sm text-gray-500">
                  更新了第三章的公式推导
                </p>
                <p className="text-xs text-gray-400">
                  2小时前
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
