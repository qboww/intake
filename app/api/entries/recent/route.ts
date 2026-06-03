import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { EntryService } from '@/lib/services/EntryService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam), 20) : 10;

    const recentEntries = await EntryService.getRecentEntries(userId, limit);

    return NextResponse.json({ entries: recentEntries });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Recent Entries API] Error:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to fetch recent entries',
        message: errorMessage,
      }, 
      { status: 500 }
    );
  }
}
