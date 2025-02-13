import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DocLayout from '@/components/DocLayout';
import { getAllChapters } from '@/lib/latex-parser';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '西浦博士生非官方攻略',
  description: '在线浏览和评论系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = getAllChapters();

  return (
    <html lang="zh">
      <body className={inter.className}>
        <DocLayout chapters={chapters}>{children}</DocLayout>
      </body>
    </html>
  );
}
