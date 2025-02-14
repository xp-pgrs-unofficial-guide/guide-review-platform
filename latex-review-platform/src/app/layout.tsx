import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DocLayout from '@/components/DocLayout';
import { getAllChapters } from '@/lib/latex-parser';
import { NextAuthProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guide Review Platform',
  description: 'A platform for reviewing and commenting on guides',
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
          <DocLayout chapters={chapters}>{children}</DocLayout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
