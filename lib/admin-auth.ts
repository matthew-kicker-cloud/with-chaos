import crypto from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "with-chaos-admin";
const SESSION_VALUE = "authenticated";

function requireAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("Missing required environment variable: ADMIN_PASSWORD");
  }
  return password;
}

function signValue(value: string): string {
  return crypto.createHmac("sha256", requireAdminPassword()).update(value).digest("hex");
}

function buildToken() {
  const signature = signValue(SESSION_VALUE);
  return `${SESSION_VALUE}.${signature}`;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }
  const [value, signature] = token.split(".");
  if (!value || !signature) {
    return false;
  }
  const expected = signValue(value);
  if (signature.length !== expected.length) {
    return false;
  }
  return value === SESSION_VALUE && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, buildToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export function validateAdminPassword(input: string): boolean {
  const password = requireAdminPassword();
  return input === password;
}
