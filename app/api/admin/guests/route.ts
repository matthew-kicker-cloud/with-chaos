import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sanitizePhotoFilenames } from "@/lib/photos";
import { createServerSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

type CreateGuestBody = {
  slug?: string;
  display_name?: string;
  greeting?: string;
  max_party_size?: number;
  photo_filenames?: unknown;
  invite_sent?: boolean;
};

function normalizeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as CreateGuestBody;
    const slug = body.slug ? normalizeSlug(body.slug) : "";
    const displayName = body.display_name?.trim() ?? "";
    const greeting = body.greeting?.trim() ?? null;
    const maxPartySize = Number(body.max_party_size ?? 1);
    const photoFilenames = sanitizePhotoFilenames(body.photo_filenames);
    const inviteSent = body.invite_sent === true;

    if (!slug || !displayName) {
      return NextResponse.json({ error: "Slug and display name are required." }, { status: 400 });
    }

    if (Number.isNaN(maxPartySize) || maxPartySize < 1) {
      return NextResponse.json({ error: "Max party size must be at least 1." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("guests")
      .insert({
        slug,
        display_name: displayName,
        greeting,
        max_party_size: maxPartySize,
        photo_filenames: photoFilenames,
        invite_sent: inviteSent
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ ok: true, guest: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not create guest." }, { status: 500 });
  }
}
