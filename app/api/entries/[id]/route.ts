import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { EntryService } from '@/lib/services/EntryService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const entry = await EntryService.getEntryById(id);

    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const entry = await EntryService.getEntryById(id);

    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const data = await request.json();
    const updatedEntry = await EntryService.updateEntry(id, data);

    return NextResponse.json({ entry: updatedEntry });
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const entry = await EntryService.getEntryById(id);

    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const deletedEntry = await EntryService.deleteEntry(id);

    return NextResponse.json({ entry: deletedEntry });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
