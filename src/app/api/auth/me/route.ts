import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { findUserById, updateUserProfile, getUserWatchlist, getUserApplications } from "@/lib/user-service";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await findUserById(session.id);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    const [watchlist, applications] = await Promise.all([
      getUserWatchlist(user.id),
      getUserApplications(user.id),
    ]);

    return NextResponse.json({
      success: true,
      user,
      watchlist,
      applications,
    });
  } catch (err: any) {
    console.error("Auth me error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Session verification failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updatedUser = await updateUserProfile(session.id, body);

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err: any) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
