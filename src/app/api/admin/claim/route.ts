import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { claimAdminIfNoAdmin } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const claimed = await claimAdminIfNoAdmin(session.user.id);
    if (!claimed) {
      return NextResponse.json({ 
        error: "Cannot claim admin role: an admin user already exists. Contact your system administrator." 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Congratulations! You have successfully been granted the Super Admin role." 
    });
  } catch (err) {
    console.error("Error claiming admin role:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
