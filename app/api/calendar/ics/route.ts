import { buildIcsContent } from "@/lib/calendar";
import { getGuestBySlug } from "@/lib/guests";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const guest = await getGuestBySlug(slug);
  if (!guest) {
    return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  }

  const ics = buildIcsContent(guest.slug);
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="with-chaos-${guest.slug}.ics"`
    }
  });
}
