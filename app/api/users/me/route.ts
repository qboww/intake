import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UserService } from '@/lib/services/UserService';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await UserService.getUserByEmail(session.user.email);
    
    // Create user if they don't exist yet
    if (!user) {
      user = await UserService.upsertByEmail(session.user.email, {
        name: session.user.name || '',
        email: session.user.email,
        image: session.user.image || undefined,
        dailyCalorieTarget: 2000, // Default target
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserService.getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    const updatedUser = await UserService.updateUser(user._id.toString(), data);
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
