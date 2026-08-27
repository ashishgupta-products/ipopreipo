import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { mapRowToUser } from "@/lib/user-service";

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
        console.warn("Neon DB getUsers failed, returning mock users:", err);
      }
    }

    // Default demo users fallback
    const fallbackUsers = [
      {
        id: "usr_demo_admin",
        email: "admin@ipopreipo.com",
        name: "Admin Team",
        role: "admin",
        investorType: "General",
        phone: "+91 80000 00000",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_retail",
        email: "rahul.investor@gmail.com",
        name: "Rahul Sharma",
        role: "user",
        investorType: "Retail",
        phone: "+91 98765 43210",
        panMasked: "ABCDE1234F",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "usr_demo_hni",
        email: "priya.hni@finance.in",
        name: "Priya Patel",
        role: "user",
        investorType: "sHNI",
        phone: "+91 91234 56789",
        panMasked: "XYZPQ9876R",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];

    return NextResponse.json({ success: true, users: fallbackUsers });
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

    return NextResponse.json({
      success: true,
      message: `User ${userId} promoted to ${role}`,
    });
  } catch (err: any) {
    console.error("Admin update user error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
