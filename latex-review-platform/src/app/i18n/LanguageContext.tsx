'use client';

import React, { createContext, useContext, useState } from 'react';
import { Language, translations } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentLang: () => 'zh' | 'en';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage first
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') as Language : null;
    // Check browser language
    const browserLang = typeof window !== 'undefined' ? navigator.language.startsWith('zh') ? 'zh' : 'en' : 'en';
    // Return saved language or browser language, fallback to 'en'
    return savedLang || browserLang || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path}`);
        return path;
      }
      current = current[key];
    }
    
    return current;
  };

  const currentLang = () => language;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
