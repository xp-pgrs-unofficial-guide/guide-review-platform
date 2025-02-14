import { NextRequest, NextResponse } from 'next/server';
import { getAllChapters } from '@/lib/latex-parser';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get('lang') || 'zh') as 'zh' | 'en';

  try {
    const chapters = await getAllChapters(lang);
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
  }
}
