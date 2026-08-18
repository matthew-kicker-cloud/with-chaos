import { AppMode, EventConfig } from "@/lib/types";

const mode: AppMode = "save_the_date";

export const eventConfig: EventConfig = {
  mode,
  title: "Amy & Matthew's Wedding Party",
  date: "2026-11-07",
  roughLocation: "The Roost. Dalston.",
  fullLocation: "The Roost, 142 Sandringham Rd, London E8 2HJ.",
  mapsUrl:
    "https://www.google.com/maps/place/The+Roost/@51.5498856,-0.0679882,17z/data=!3m1!4b1!4m6!3m5!1s0x48761cf3b0813bfd:0x3857eb5844f2ba9a!8m2!3d51.5498823!4d-0.0654133!16s%2Fg%2F12hrrjqsy?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D",
  details: "Hello! \n\nWe are so excited to celebrate our wedding with you! Please join us for a night of dancing, drinks, and fun. We can't wait to see you there!\n\nLove,\nAmy & Matthew",
  dressCode: "Formal. Fancy. Black Tie Optional. Feel Great.",
  startTime: "4:00 PM",
  endTime: "Midnight. (actual carriages expected).",
  startTime24: "16:00",
  endTime24: "00:00",
  timeZone: "Europe/London",
  rsvpDeadline: "1st October 2026",
};

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
