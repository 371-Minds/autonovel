
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { prototypeId, sceneId, choices, currentState } = await request.json();
    
    // For now, we'll use a temporary user ID - in a real app this would come from authentication
    const tempUserId = 'temp-user-id';
    
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_prototypeId: {
          userId: tempUserId,
          prototypeId
        }
      },
      create: {
        userId: tempUserId,
        prototypeId,
        sceneId,
        choices,
        currentState,
      },
      update: {
        sceneId,
        choices,
        currentState,
        lastAccessed: new Date(),
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const prototypeId = url.searchParams.get('prototypeId');
    const tempUserId = 'temp-user-id';
    
    if (prototypeId) {
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_prototypeId: {
            userId: tempUserId,
            prototypeId
          }
        }
      });
      return NextResponse.json(progress);
    } else {
      const allProgress = await prisma.userProgress.findMany({
        where: { userId: tempUserId }
      });
      return NextResponse.json(allProgress);
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
