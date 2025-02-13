import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          欢迎使用文档评审系统
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          请从左侧目录选择要阅读的章节
        </p>
      </div>

      <div className="mt-12 bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">使用说明</h2>
        <div className="prose prose-indigo">
          <ul className="list-disc pl-5 space-y-2">
            <li>点击左侧的章节标题可以阅读相应内容</li>
            <li>每个章节下方都有评论区，可以进行讨论</li>
            <li>支持 LaTeX 数学公式的显示</li>
            <li>点击左上角的菜单图标可以隐藏/显示目录</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
