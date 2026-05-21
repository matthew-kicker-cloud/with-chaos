export function formatDisplayDate(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}
