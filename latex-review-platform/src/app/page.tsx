'use client';

import { useLanguage } from './i18n/LanguageContext';

// 添加动态路由配置，防止静态预渲染
export const dynamic = 'force-dynamic';

export default function Home() {
  const { currentLang } = useLanguage();

  const content = {
    zh: {
      title: '西浦博士生非官方攻略',
      subtitle: '欢迎使用攻略在线平台',
      usageTitle: '使用说明',
      introduction: '这是一个简单易用的浏览及评论平台，专为 ',
      guideLink: '西浦博士生非官方攻略',
      guideLinkUrl: 'https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide',
      introEnd: ' 开发。你可以通过此平台阅读攻略内容，并分章节进行评论和讨论。',
      instructions: [
        '点击左侧的章节标题可以阅读相应内容',
        '每个章节下方都有评论区，可以进行讨论',
        '点击左上角的菜单图标可以隐藏/显示目录'
      ],
      feedback: '针对此平台的功能需求，欢迎 ',
      submitIssue: '提交 Issue',
      issuesUrl: 'https://github.com/xp-pgrs-unofficial-guide/guide-review-platform/issues',
      feedbackMiddle: '；针对攻略的内容本身，您可直接在平台中使用讨论功能留言参与讨论，请参考攻略 ',
      chineseVersion: '中文版',
      or: ' 或 ',
      englishVersion: '英文版',
      feedbackEnd: ' 的说明进行反馈。'
    },
    en: {
      title: 'Unofficial Guide for XJTLU PhD Students',
      subtitle: 'Welcome to use the online platform',
      usageTitle: 'Usage Guide',
      introduction: 'This is a user-friendly browsing and commenting platform developed for the ',
      guideLink: 'Unofficial Guide for XJTLU PhD Students',
      guideLinkUrl: 'https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide_EN',
      introEnd: '. You can read the guide content and participate in chapter-by-chapter discussions through this platform.',
      instructions: [
        'Click on chapter titles on the left to read the content',
        'Each chapter has a comment section for discussions',
        'Click the menu icon in the top-left corner to hide/show the table of contents'
      ],
      feedback: 'For platform feature requests, please ',
      submitIssue: 'submit an issue',
      issuesUrl: 'https://github.com/xp-pgrs-unofficial-guide/guide-review-platform/issues',
      feedbackMiddle: '; for feedback on the guide content itself, you can leave comments using the discussion feature in the platform, please refer to the ',
      chineseVersion: 'Chinese version',
      or: ' or ',
      englishVersion: 'English version',
      englishVersionUrl: 'https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide_EN',
      feedbackEnd: ' of the guide for feedback instructions.'
    }
  };

  const lang = currentLang() === 'zh' ? content.zh : content.en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          {lang.title}
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          {lang.subtitle}
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{lang.usageTitle}</h2>
        <div className="prose prose-indigo">
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              {lang.introduction}
              <a href={lang.guideLinkUrl} className="underline text-black">
                {lang.guideLink}
              </a>
              {lang.introEnd}
            </li>
            {lang.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
            <li>
              {lang.feedback}
              <a href={lang.issuesUrl} className="underline text-black">
                {lang.submitIssue}
              </a>
              {lang.feedbackMiddle}
              <a href="https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide" className="underline text-black">
                {lang.chineseVersion}
              </a>
              {lang.or}
              <a href="https://github.com/xp-pgrs-unofficial-guide/xp_pgrs_unofficial_guide_EN" className="underline text-black">
                {lang.englishVersion}
              </a>
              {lang.feedbackEnd}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
