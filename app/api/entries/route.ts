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
    
    // Optional: filter by date
    const dateParam = request.nextUrl.searchParams.get('date');
    const rangeParam = request.nextUrl.searchParams.get('range');

    let entries;
    
    if (dateParam) {
      const date = new Date(dateParam);
      entries = await EntryService.getEntriesByUserAndDate(userId, date);
    } else if (rangeParam) {
      const [startStr, endStr] = rangeParam.split(',');
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      entries = await EntryService.getEntriesByUserAndDateRange(userId, startDate, endDate);
    } else {
      entries = await EntryService.getEntriesByUser(userId);
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
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

    const entry = await EntryService.createEntry({
      userId,
      ...data,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
