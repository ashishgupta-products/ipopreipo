import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sign out" },
      { status: 500 }
    );
  }
}
