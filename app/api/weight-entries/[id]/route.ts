import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { WeightEntryService } from '@/lib/services/WeightEntryService';

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
    const entry = await WeightEntryService.getWeightEntryById(id);

    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Weight entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error('Error fetching weight entry:', error);
    return NextResponse.json({ error: 'Failed to fetch weight entry' }, { status: 500 });
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
    const entry = await WeightEntryService.getWeightEntryById(id);

    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Weight entry not found' }, { status: 404 });
    }

    const data = await request.json();
    const updatedEntry = await WeightEntryService.updateWeightEntry(id, data);

    return NextResponse.json({ entry: updatedEntry });
  } catch (error) {
    console.error('Error updating weight entry:', error);
    return NextResponse.json({ error: 'Failed to update weight entry' }, { status: 500 });
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
    const entry = await WeightEntryService.getWeightEntryById(id);

    if (!entry || entry.userId !== userId) {
      return NextResponse.json({ error: 'Weight entry not found' }, { status: 404 });
    }

    const deletedEntry = await WeightEntryService.deleteWeightEntry(id);

    return NextResponse.json({ entry: deletedEntry });
  } catch (error) {
    console.error('Error deleting weight entry:', error);
    return NextResponse.json({ error: 'Failed to delete weight entry' }, { status: 500 });
  }
}
