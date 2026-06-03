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
    const entries = await WeightEntryService.getWeightEntriesByUser(userId);

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching weight entries:', error);
    return NextResponse.json({ error: 'Failed to fetch weight entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const data = await request.json();

    const entry = await WeightEntryService.createWeightEntry({
      userId,
      ...data,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating weight entry:', error);
    return NextResponse.json({ error: 'Failed to create weight entry' }, { status: 500 });
  }
}
