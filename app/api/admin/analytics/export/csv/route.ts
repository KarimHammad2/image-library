import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { getAnalytics } from "@/lib/db";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get("adlib_session")?.value;
  const payload = session ? await verifySessionToken(session) : null;
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await getAnalytics();
  const header = "id,type,userId,timestamp,metadata";
  const rows = events.map((evt) =>
    [
      evt.id,
      evt.type,
      evt.userId ?? "",
      evt.timestamp,
      JSON.stringify(evt.metadata ?? {}),
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="analytics.csv"',
    },
  });
}

