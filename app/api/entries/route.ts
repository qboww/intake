import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { EntryService } from '@/lib/services/EntryService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Allow fetching entries for a specific user (for user switcher)
    // or default to authenticated user
    const userIdParam = request.nextUrl.searchParams.get('userId');
    const userId = userIdParam || session.user.email;
    
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

    console.log('[Entry API] Creating entry with data:', JSON.stringify({ userId, data }, null, 2));

    const entry = await EntryService.createEntry({
      userId,
      ...data,
    });

    console.log('[Entry API] Entry created successfully:', entry._id);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error instanceof Error ? error : null;
    
    console.error('[Entry API] Error creating entry:', errorMessage);
    console.error('[Entry API] Full error:', errorDetails);
    
    // Return detailed error for development debugging
    return NextResponse.json(
      { 
        error: 'Failed to create entry',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(errorDetails) : undefined
      }, 
      { status: 500 }
    );
  }
}
