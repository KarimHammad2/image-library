import { jwtVerify } from "jose";
import type { SessionPayload } from "./types";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "demo-secret-change-this-in-production-for-animal-library";

const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

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

export const SESSION_COOKIE = "adlib_session";

