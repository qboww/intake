import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { WeightEntryService } from '@/lib/services/WeightEntryService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

    const data = await WeightEntryService.get30DayWeightData(userId);

    return NextResponse.json({ data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Weight Chart API] Error:', errorMessage);
    return NextResponse.json(
      {
        error: 'Failed to fetch weight chart data',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
