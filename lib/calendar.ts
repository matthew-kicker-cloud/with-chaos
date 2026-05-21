import { eventConfig, siteUrl } from "@/lib/config";

function toIsoDate(date: string): string {
  return date.replace(/-/g, "");
}

function escapeIcsText(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildInviteUrl(slug: string): string {
  return `${siteUrl}/${slug}`;
}

export function buildGoogleCalendarUrl(slug: string): string {
  const start = toIsoDate(eventConfig.date);
  const endDate = new Date(eventConfig.date);
  endDate.setDate(endDate.getDate() + 1);
  const end = toIsoDate(endDate.toISOString().slice(0, 10));

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventConfig.title,
    dates: `${start}/${end}`,
    location: eventConfig.fullLocation,
    details: `${eventConfig.details}\nInvite: ${buildInviteUrl(slug)}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(slug: string): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const start = toIsoDate(eventConfig.date);
  const endDate = new Date(eventConfig.date);
  endDate.setDate(endDate.getDate() + 1);
  const end = toIsoDate(endDate.toISOString().slice(0, 10));
  const uid = `${slug}-${start}@with-chaos`;
  const inviteUrl = buildInviteUrl(slug);
  const description = `${eventConfig.details}\\nInvite: ${inviteUrl}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//with-chaos//invite//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(uid)}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcsText(eventConfig.title)}`,
    `LOCATION:${escapeIcsText(eventConfig.fullLocation)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
