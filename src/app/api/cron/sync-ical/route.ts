import { NextRequest, NextResponse } from "next/server";
import { syncAllImports } from "@/lib/syncIcal";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await syncAllImports();
  return NextResponse.json({ ok: true });
}
