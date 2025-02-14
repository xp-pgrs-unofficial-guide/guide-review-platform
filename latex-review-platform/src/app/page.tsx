import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          欢迎使用西浦博士生非官方攻略在线平台
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          请从左侧目录选择要阅读的章节
        </p>
      </div>

      <div className="mt-12 bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">使用说明</h2>
        <div className="prose prose-indigo">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>这是一个简单易用的浏览及评论平台，专为 <a href="https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide" className="underline text-black">西浦博士生非官方攻略</a> 开发。你可以通过此平台阅读攻略内容，并分章节进行评论和讨论。</li>
            <li>点击左侧的章节标题可以阅读相应内容</li>
            <li>每个章节下方都有评论区，可以进行讨论</li>
            <li>点击左上角的菜单图标可以隐藏/显示目录</li>
            <li>针对此平台的功能需求，欢迎 <a href="https://github.com/xp-pgrs-unofficial-guide/guide-review-platform/issues" className="underline text-black">提交 Issue</a>；针对攻略的内容本身，您可直接在平台中使用讨论功能留言参与讨论，请参考攻略 <a href="https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide" className="underline text-black">中文版</a> 或 <a href="https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide_EN" className="underline text-black">英文版</a> 的说明进行反馈。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
