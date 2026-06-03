import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CalorieStatsService } from '@/lib/services/CalorieStatsService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

    const data = await CalorieStatsService.get30DayData(userId);

    return NextResponse.json({ data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Stats 30Day API] Error:', errorMessage);
    return NextResponse.json(
      {
        error: 'Failed to fetch 30-day data',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
