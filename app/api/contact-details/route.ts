import { getGuestBySlug } from "@/lib/guests";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ContactDetailsPayload } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactDetailsPayload>;
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
        email: (body.email ?? "").trim() || null,
        phone: (body.phone ?? "").trim() || null,
        mailing_address: (body.mailingAddress ?? "").trim() || null,
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
    return NextResponse.json({ error: "Could not save contact details." }, { status: 500 });
  }
}
