import { getGuestBySlug } from "@/lib/guests";
import { createServerSupabaseClient } from "@/lib/supabase";
import { SaveTheDateDeclinePayload } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SaveTheDateDeclinePayload>;
    if (!body.slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    const guest = await getGuestBySlug(body.slug);
    if (!guest) {
      return NextResponse.json({ error: "Guest not found." }, { status: 404 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("guests")
      .update({
        rsvp_status: "not_attending",
        attending_count: 0,
        declined_at_save_the_date: true,
        email: (body.email ?? "").trim() || null,
        contact_details_updated_at: new Date().toISOString()
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
    return NextResponse.json(
      { error: "Could not save save-the-date decline." },
      { status: 500 }
    );
  }
}
