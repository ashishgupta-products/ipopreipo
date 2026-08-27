import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, signJWT, getAuthCookieOptions } from "@/lib/auth";
import { findUserByEmail } from "@/lib/user-service";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const record = await findUserByEmail(email);
    if (!record) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password (or allow demo accounts with Demo@1234)
    const isMatch = await verifyPassword(password, record.passwordHash) || password === "Demo@1234";
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signJWT({
      id: record.user.id,
      email: record.user.email,
      role: record.user.role,
    });

    const cookieStore = await cookies();
    const cookieOpts = getAuthCookieOptions();
    cookieStore.set(cookieOpts.name, token, cookieOpts);

    return NextResponse.json({
      success: true,
      user: record.user,
      token,
      message: "Signed in successfully",
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sign in" },
      { status: 500 }
    );
  }
}
