import { NextRequest, NextResponse } from "next/server";
import { syncListingImports } from "@/lib/syncIcal";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const results = await syncListingImports(id);
  return NextResponse.json({ results });
}
