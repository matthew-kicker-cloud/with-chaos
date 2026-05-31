import { AppMode, EventConfig } from "@/lib/types";

const mode: AppMode = "save_the_date";

export const eventConfig: EventConfig = {
  mode,
  title: "Amy & Matthew's Wedding Party",
  date: "2026-11-14",
  roughLocation: "Somewhere in London.",
  fullLocation: "Somewhere in London.",
  details: "More details to be confirmed shortly...",
};

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
