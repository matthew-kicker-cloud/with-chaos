import { getGuestBySlug } from "@/lib/guests";
import { createServerSupabaseClient } from "@/lib/supabase";
import { RsvpPayload } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RsvpPayload>;

    if (!body.slug || (body.attending !== "yes" && body.attending !== "no")) {
      return NextResponse.json({ error: "Invalid RSVP payload." }, { status: 400 });
    }

    const guest = await getGuestBySlug(body.slug);
    if (!guest) {
      return NextResponse.json({ error: "Guest not found." }, { status: 404 });
    }

    const requestedCount = Number(body.attendingCount ?? 0);
    const attendingCount = body.attending === "yes" ? requestedCount : 0;

    if (body.attending === "yes" && (Number.isNaN(attendingCount) || attendingCount < 1)) {
      return NextResponse.json({ error: "Attending count must be at least 1." }, { status: 400 });
    }

    if (attendingCount > guest.max_party_size) {
      return NextResponse.json(
        { error: `Party size cannot exceed your max of ${guest.max_party_size}.` },
        { status: 400 }
      );
    }

    const boozyLevel = Number(body.boozyLevel ?? guest.boozy_level ?? 5);
    if (!Number.isInteger(boozyLevel) || boozyLevel < 0 || boozyLevel > 10) {
      return NextResponse.json({ error: "Boozy level must be between 0 and 10." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("guests")
      .update({
        rsvp_status: body.attending === "yes" ? "attending" : "not_attending",
        attending_count: attendingCount,
        declined_at_save_the_date:
          body.attending === "yes" ? false : guest.declined_at_save_the_date,
        dietary_notes: (body.dietaryNotes ?? "").trim() || null,
        boozy_level: boozyLevel,
        message: (body.message ?? "").trim() || null
      })
      .eq("id", guest.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, guest: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save RSVP." }, { status: 500 });
  }
}
