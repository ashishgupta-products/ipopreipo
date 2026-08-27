import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signJWT, getAuthCookieOptions } from "@/lib/auth";
import { findUserByEmail, createUser } from "@/lib/user-service";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, investorType } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Full Name is required" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email address is required" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      name,
      email,
      passwordHash,
      investorType: investorType || "Retail",
    });

    const token = await signJWT({ id: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    const cookieOpts = getAuthCookieOptions();
    cookieStore.set(cookieOpts.name, token, cookieOpts);

    return NextResponse.json({
      success: true,
      user,
      token,
      message: "Account created successfully",
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
