import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { mapRowToUser, getAllUsers, updateUserRole } from "@/lib/user-service";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (sql) {
      try {
        const rows = await sql`
          SELECT id, email, name, avatar_url, role, investor_type, phone, pan_masked, created_at, updated_at
          FROM users
          ORDER BY created_at DESC
        `;
        const users = rows.map((r: any) => mapRowToUser(r));
        return NextResponse.json({ success: true, users });
      } catch (err) {
        console.warn("Neon DB getUsers failed, returning fallback users:", err);
      }
    }

    const users = await getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error("Admin get users error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load users" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.email !== "admin@ipopreipo.com")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ success: false, error: "userId and role are required" }, { status: 400 });
    }

    if (sql) {
      try {
        await sql`
          UPDATE users SET role = ${role}, updated_at = CURRENT_TIMESTAMP WHERE id = ${userId}
        `;
      } catch (err) {
        console.warn("Neon DB update user role failed:", err);
      }
    }

    await updateUserRole(userId, role);

    return NextResponse.json({
      success: true,
      message: `User ${userId} updated to ${role}`,
    });
  } catch (err: any) {
    console.error("Admin update user error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
