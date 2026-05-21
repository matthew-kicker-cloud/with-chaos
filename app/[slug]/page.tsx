import { InviteClient } from "@/components/InviteClient";
import { buildGoogleCalendarUrl } from "@/lib/calendar";
import { eventConfig } from "@/lib/config";
import { formatDisplayDate } from "@/lib/date";
import { getGuestBySlug } from "@/lib/guests";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

type InvitePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  if (eventConfig.mode === "save_the_date" && !guest.save_the_date_seen_at) {
    const supabase = createServerSupabaseClient();
    await supabase.from("guests").update({ save_the_date_seen_at: new Date().toISOString() }).eq("id", guest.id);
  }

  const eventDate = formatDisplayDate(eventConfig.date);
  const googleCalendarUrl = buildGoogleCalendarUrl(guest.slug);
  const icsUrl = `/api/calendar/ics?slug=${encodeURIComponent(guest.slug)}`;

  return (
    <InviteClient
      guest={guest}
      mode={eventConfig.mode}
      eventTitle={eventConfig.title}
      eventDate={eventDate}
      eventLocation={eventConfig.mode === "save_the_date" ? eventConfig.roughLocation : eventConfig.fullLocation}
      eventDetailsText={eventConfig.mode === "save_the_date" ? "Full details coming soon." : eventConfig.details}
      googleCalendarUrl={googleCalendarUrl}
      icsUrl={icsUrl}
    />
  );
}
