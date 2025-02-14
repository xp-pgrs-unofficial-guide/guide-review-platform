import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import DocLayout from '@/components/DocLayout';
import { NextAuthProvider } from './providers';
import { LanguageProvider } from './i18n/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XJTLU PhD Guide',
  description: 'XJTLU PhD Guide',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content?lang=zh`).then(res => res.json());

  return (
    <html>
      <body className={inter.className}>
        <NextAuthProvider>
          <LanguageProvider>
            <Navbar />
            <DocLayout initialChapters={chapters}>
              {children}
            </DocLayout>
          </LanguageProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
