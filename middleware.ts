import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/auth-edge";

const loginUrl = "/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  const payload = session ? await verifySessionToken(session) : null;

  const requiresAdmin = pathname.startsWith("/admin");
  const requiresMember =
    pathname.startsWith("/library") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/premium");

  if (requiresAdmin) {
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }
    return NextResponse.next();
  }

  if (requiresMember && !payload) {
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/library/:path*", "/compare/:path*", "/premium/:path*", "/admin/:path*"],
};

