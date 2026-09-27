import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllUsersForAdmin, updateUserRole, deleteUser } from "@/lib/db";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = (session.user as any).role;
  if (role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }) };
  }
  return { user: session.user };
}

export async function GET() {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const users = await getAllUsersForAdmin();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users for admin:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role || !["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "Invalid userId or role (must be 'admin' or 'user')" }, { status: 400 });
    }

    const updated = await updateUserRole(userId, role);
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("Error updating user role:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId parameter required" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === authRes.user?.id) {
      return NextResponse.json({ error: "Cannot delete your own admin account" }, { status: 400 });
    }

    const success = await deleteUser(userId);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
