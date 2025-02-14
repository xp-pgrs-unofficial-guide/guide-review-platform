import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get comments for a specific chapter
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chapterId = searchParams.get('chapterId');

  console.log('GET /api/comments - Fetching comments for chapter:', chapterId);

  if (!chapterId) {
    console.error('GET /api/comments - Missing chapterId');
    return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        chapterId,
        parentId: null, // Only get top-level comments
      },
      include: {
        replies: {
          include: {
            replies: true // Include nested replies
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('GET /api/comments - Found comments:', comments);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('GET /api/comments - Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(request: NextRequest) {
  console.log('POST /api/comments - Received request');
  
  try {
    const body = await request.json();
    console.log('POST /api/comments - Request body:', body);
    
    const { content, authorName, chapterId, parentId } = body;

    if (!content || !authorName || !chapterId) {
      console.error('POST /api/comments - Missing required fields:', { content, authorName, chapterId });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('POST /api/comments - Creating comment with data:', {
      content,
      authorName,
      chapterId,
      parentId,
    });

    const comment = await prisma.comment.create({
      data: {
        content,
        authorName,
        chapterId,
        parentId,
      },
      include: {
        replies: true,
      },
    });

    console.log('POST /api/comments - Created comment:', comment);
    return NextResponse.json(comment);
  } catch (error) {
    console.error('POST /api/comments - Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    );
  }
}
