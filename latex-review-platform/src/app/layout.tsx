import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import DocLayout from '@/components/DocLayout';
import { NextAuthProvider } from './providers';
import { getAllChapters } from '@/lib/latex-parser';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '西浦博士生非官方攻略',
  description: '西浦博士生非官方攻略',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chapters = await getAllChapters();

  return (
    <html lang="zh">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          <DocLayout chapters={chapters}>
            {children}
          </DocLayout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
