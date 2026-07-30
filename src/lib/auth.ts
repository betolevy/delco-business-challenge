import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "lc_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h — long enough to cover a full event day

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) env var — required to sign admin sessions."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("Missing ADMIN_PASSWORD env var.");
  }
  return password === expected;
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;
