import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getUsers } from "./db";
import type { SessionPayload, User } from "./types";

const SESSION_COOKIE = "adlib_session";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "demo-secret-change-this-in-production-for-animal-library";

const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(password));
    return toHex(digest);
  }
  const { createHash } = await import("crypto");
  return createHash("sha256").update(password).digest("hex");
}

export async function verifyPassword(password: string, hash: string) {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

export async function createSessionToken(user: User) {
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    isPremium: user.isPremium,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session token", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const users = await getUsers();
  const user = users.find((u) => u.id === payload.userId);
  return user ?? null;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

