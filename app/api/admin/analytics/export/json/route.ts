import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { getAnalytics } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("adlib_session")?.value;
  const payload = session ? await verifySessionToken(session) : null;
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await getAnalytics();
  return NextResponse.json(events, {
    headers: {
      "Content-Disposition": 'attachment; filename="analytics.json"',
    },
  });
}

