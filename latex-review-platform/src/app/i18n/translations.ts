export const translations = {
  zh: {
    nav: {
      home: '首页',
      login: '登录',
      register: '注册',
      logout: '退出登录',
    },
    common: {
      switchLang: 'Switch to English',
      comments: '评论区',
      submit: '提交',
      cancel: '取消',
      loading: '加载中...',
      error: '出错了',
    },
    meta: {
      title: '西浦博士生非官方攻略',
      description: '西浦博士生非官方攻略',
    }
  },
  en: {
    nav: {
      home: 'Home',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    common: {
      switchLang: '切换到中文',
      comments: 'Comments',
      submit: 'Submit',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Error',
    },
    meta: {
      title: 'XJTLU PhD Guide',
      description: 'XJTLU PhD Guide',
    }
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations[Language];
