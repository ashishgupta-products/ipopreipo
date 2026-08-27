import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { User } from "@/types/auth";

export const AUTH_COOKIE_NAME = "ipopreipo_session";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "ipopreipo-jwt-super-secure-key-2026-production";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

/**
 * Hashes a plaintext password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password with stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/**
 * Signs a JWT with user payload
 */
export async function signJWT(payload: { id: string; email: string; role: string }, expiresIn = "7d"): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token and returns payload if valid
 */
export async function verifyJWT(token: string): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

/**
 * Get standard cookie configuration for auth token
 */
export function getAuthCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Helper to get current authenticated user token payload from Next.js headers/cookies
 */
export async function getSessionUser(): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch {
    return null;
  }
}
