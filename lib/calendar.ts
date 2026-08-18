import { eventConfig, siteUrl } from "@/lib/config";

function getTimezoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(date);

  const values: Record<string, string> = {};
  for (const part of parts) {
    values[part.type] = part.value;
  }

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return (asUtc - date.getTime()) / 60000;
}

function zonedTimeToUtc(dateIso: string, time24: string, timeZone: string): Date {
  const [year, month, day] = dateIso.split("-").map(Number);
  const [hour, minute] = time24.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMinutes = getTimezoneOffsetMinutes(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offsetMinutes * 60000);
}

function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function getEventBounds(): { start: Date; end: Date } {
  const start = zonedTimeToUtc(eventConfig.date, eventConfig.startTime24, eventConfig.timeZone);

  let endDateIso = eventConfig.date;
  if (eventConfig.endTime24 <= eventConfig.startTime24) {
    const nextDay = new Date(`${eventConfig.date}T00:00:00Z`);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    endDateIso = nextDay.toISOString().slice(0, 10);
  }
  const end = zonedTimeToUtc(endDateIso, eventConfig.endTime24, eventConfig.timeZone);

  return { start, end };
}

function escapeIcsText(input: string): string {
  return input.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildInviteUrl(slug: string): string {
  return `${siteUrl}/${slug}`;
}

export function buildGoogleCalendarUrl(slug: string): string {
  const { start, end } = getEventBounds();

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventConfig.title,
    dates: `${formatUtc(start)}/${formatUtc(end)}`,
    location: eventConfig.fullLocation,
    details: `${eventConfig.details}\nInvite: ${buildInviteUrl(slug)}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsContent(slug: string): string {
  const now = formatUtc(new Date());
  const { start, end } = getEventBounds();
  const uid = `${slug}-${formatUtc(start)}@with-chaos`;
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
    `DTSTART:${formatUtc(start)}`,
    `DTEND:${formatUtc(end)}`,
    `SUMMARY:${escapeIcsText(eventConfig.title)}`,
    `LOCATION:${escapeIcsText(eventConfig.fullLocation)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}
