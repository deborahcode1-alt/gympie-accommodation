import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const hosts = await prisma.host.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, squareAccessToken: true, squareLocationId: true },
  });
  // Never send the raw Square token to the client — only whether one's configured.
  const safeHosts = hosts.map(({ squareAccessToken, squareLocationId, ...h }) => ({
    ...h,
    squareConnected: !!squareAccessToken && !!squareLocationId,
  }));
  return NextResponse.json({ hosts: safeHosts });
}

const createSchema = z.object({ name: z.string().min(1).max(200) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const host = await prisma.host.create({ data: { name: parsed.data.name } });
  return NextResponse.json({ host }, { status: 201 });
}
