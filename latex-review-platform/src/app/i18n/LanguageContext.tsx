'use client';

import React, { createContext, useContext, useState } from 'react';
import { Language, translations } from './translations';

type NestedTranslation = {
  [key: string]: string | NestedTranslation;
};

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
    let current: NestedTranslation = translations[language];
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (typeof current[key] !== 'object') {
        console.warn(`Translation path invalid at key: ${key} in path: ${path}`);
        return path;
      }
      current = current[key] as NestedTranslation;
    }

    const finalKey = keys[keys.length - 1];
    const finalValue = current[finalKey];
    
    if (typeof finalValue !== 'string') {
      console.warn(`Translation value is not a string for path: ${path}`);
      return path;
    }
    
    return finalValue;
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
