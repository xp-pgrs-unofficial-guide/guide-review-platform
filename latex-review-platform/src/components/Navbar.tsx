'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, currentLang } = useLanguage();

  return (
    <nav className="h-14 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          {currentLang() === 'zh' ? '西浦博士生非官方攻略' : 'XJTLU PhD Guide'}
        </h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {session ? (
            <>
              <span className="text-gray-700">
                {session.user?.username || session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
