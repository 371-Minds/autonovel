
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { FeedbackData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data: FeedbackData = await request.json();
    
    const feedback = await prisma.feedback.create({
      data: {
        prototypeId: data.prototypeId,
        rating: data.rating,
        categories: data.categories,
        comment: data.comment,
        feedbackType: data.feedbackType,
      }
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      select: {
        id: true,
        prototypeId: true,
        rating: true,
        categories: true,
        feedbackType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
