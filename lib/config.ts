import { AppMode, EventConfig } from "@/lib/types";

const mode: AppMode = "rsvp_open";

export const eventConfig: EventConfig = {
  mode,
  title: "Amy & Matthew's Wedding Party",
  date: "2026-11-07",
  roughLocation: "The Roost. Dalston.",
  fullLocation: "The Roost, 142 Sandringham Rd, London E8 2HJ.",
  mapsUrl:
    "https://www.google.com/maps/place/The+Roost/@51.5498856,-0.0679882,17z/data=!3m1!4b1!4m6!3m5!1s0x48761cf3b0813bfd:0x3857eb5844f2ba9a!8m2!3d51.5498823!4d-0.0654133!16s%2Fg%2F12hrrjqsy?entry=ttu&g_ep=EgoyMDI2MDgxNi4wIKXMDSoASAFQAw%3D%3D",
  details: "We would love you to celebrate our wedding with us on 7th November at The Roost, Dalston. Join us for a few drinks, a couple of speeches, some food, and most importantly, dancing.\n\nArrive at 4pm and leave before midnight - the Windrush from Dalston Junction stops at 00:15 but we won't hold you to it. You can park on the road outside; it's one of those pay on your phone things.\n\nIf you are in the gift giving mood then we would absolutely love you to bring a copy of your favourite book or your favourite album (CD/cassette/record/any physical media format will be accepted, no I don't want a USB stick).\n\nThe venue is not super child friendly. We would recommend taking the evening off from parenting but if you have any questions or issues please get in contact with us.",
  dressCode: "Please come dressed up: black tie is not required but would not look out of place, think fancy, think wintery formalwear, but, it is completely essential that your attire does not impinge on your dance moves!",
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
