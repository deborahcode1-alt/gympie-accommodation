import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const addSchema = z.object({
  url: z.string().url(),
  alt: z.string().max(200).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const count = await prisma.photo.count({ where: { listingId: id } });
  const photo = await prisma.photo.create({
    data: {
      listingId: id,
      url: parsed.data.url,
      alt: parsed.data.alt ?? "",
      order: count,
    },
  });

  return NextResponse.json({ photo }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const photoId = req.nextUrl.searchParams.get("photoId");
  if (!photoId) return NextResponse.json({ error: "photoId required" }, { status: 400 });
  await prisma.photo.delete({ where: { id: photoId } });
  return NextResponse.json({ ok: true });
}
