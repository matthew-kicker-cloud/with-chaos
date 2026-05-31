import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllGuests } from "@/lib/guests";
import { NextResponse } from "next/server";

function escapeCsv(value: string | number | boolean | null): string {
  const raw = value === null ? "" : String(value);
  const escaped = raw.replace(/"/g, "\"\"");
  return `"${escaped}"`;
}

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const guests = await getAllGuests();
  const headers = [
    "id",
    "slug",
    "display_name",
    "greeting",
    "max_party_size",
    "photo_filenames",
    "invite_sent",
    "email",
    "phone",
    "mailing_address",
    "rsvp_status",
    "attending_count",
    "dietary_notes",
    "song_request",
    "message",
    "save_the_date_seen_at",
    "declined_at_save_the_date",
    "contact_details_updated_at",
    "created_at",
    "updated_at"
  ];

  const rows = guests.map((guest) =>
    [
      guest.id,
      guest.slug,
      guest.display_name,
      guest.greeting,
      guest.max_party_size,
      guest.photo_filenames.join("|"),
      guest.invite_sent,
      guest.email,
      guest.phone,
      guest.mailing_address,
      guest.rsvp_status,
      guest.attending_count,
      guest.dietary_notes,
      guest.song_request,
      guest.message,
      guest.save_the_date_seen_at,
      guest.declined_at_save_the_date,
      guest.contact_details_updated_at,
      guest.created_at,
      guest.updated_at
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"with-chaos-guests.csv\""
    }
  });
}
