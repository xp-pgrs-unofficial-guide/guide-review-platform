import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Get comments for a specific chapter
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chapterId = searchParams.get('chapterId');

  console.log('GET /api/comments - Fetching comments for chapter:', chapterId);

  if (!chapterId) {
    console.error('GET /api/comments - Missing chapterId');
    return NextResponse.json(
      { error: 'Missing chapterId parameter' },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        chapterId: chapterId,
        parentId: null, // Only get top-level comments
      },
      include: {
        replies: {
          include: {
            replies: true, // Include nested replies
          },
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
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content, chapterId, parentId } = body;

    if (!content || !chapterId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        chapterId,
        parentId,
        authorId: session.user.id,
        authorName: session.user.username || session.user.name || 'Anonymous',
      },
      include: {
        replies: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
