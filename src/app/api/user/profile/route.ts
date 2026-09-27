import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { updateUserProfile, findUserById } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await findUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      investorCategory: user.investor_category,
      dematProvider: user.demat_provider,
      image: user.image,
      createdAt: user.created_at,
    },
  });
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, investorCategory, dematProvider } = body;

    const updatedUser = await updateUserProfile(session.user.id, {
      name,
      phone,
      investorCategory,
      dematProvider,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully in Neon DB.',
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        phone: updatedUser?.phone,
        investorCategory: updatedUser?.investor_category,
        dematProvider: updatedUser?.demat_provider,
        image: updatedUser?.image,
      },
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
