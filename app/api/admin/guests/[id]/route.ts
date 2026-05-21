import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sanitizePhotoFilenames } from "@/lib/photos";
import { createServerSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

type UpdateGuestBody = {
  slug?: string;
  display_name?: string;
  greeting?: string;
  max_party_size?: number;
  photo_filenames?: unknown;
};

function normalizeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as UpdateGuestBody;
    const slug = body.slug ? normalizeSlug(body.slug) : "";
    const displayName = body.display_name?.trim() ?? "";
    const greeting = body.greeting?.trim() ?? null;
    const maxPartySize = Number(body.max_party_size ?? 1);
    const photoFilenames = sanitizePhotoFilenames(body.photo_filenames);

    if (!slug || !displayName) {
      return NextResponse.json({ error: "Slug and display name are required." }, { status: 400 });
    }

    if (Number.isNaN(maxPartySize) || maxPartySize < 1) {
      return NextResponse.json({ error: "Max party size must be at least 1." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const existing = await supabase.from("guests").select("attending_count").eq("id", id).maybeSingle();
    if (existing.error) {
      throw existing.error;
    }
    if (!existing.data) {
      return NextResponse.json({ error: "Guest not found." }, { status: 404 });
    }
    if ((existing.data.attending_count ?? 0) > maxPartySize) {
      return NextResponse.json(
        { error: "Max party size cannot be less than current attending count." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("guests")
      .update({
        slug,
        display_name: displayName,
        greeting,
        max_party_size: maxPartySize,
        photo_filenames: photoFilenames
      })
      .eq("id", id)
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
    return NextResponse.json({ error: "Could not update guest." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not delete guest." }, { status: 500 });
  }
}
