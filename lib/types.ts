export type AppMode = "save_the_date" | "rsvp_open";

export type Guest = {
  id: string;
  slug: string;
  display_name: string;
  greeting: string | null;
  max_party_size: number;
  photo_filenames: string[];
  email: string | null;
  phone: string | null;
  mailing_address: string | null;
  rsvp_status: "pending" | "attending" | "not_attending";
  attending_count: number;
  dietary_notes: string | null;
  song_request: string | null;
  message: string | null;
  save_the_date_seen_at: string | null;
  declined_at_save_the_date: boolean;
  contact_details_updated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EventConfig = {
  mode: AppMode;
  title: string;
  date: string;
  roughLocation: string;
  fullLocation: string;
  details: string;
};

export type RsvpPayload = {
  slug: string;
  attending: "yes" | "no";
  attendingCount: number;
  dietaryNotes: string;
  songRequest: string;
  message: string;
};

export type ContactDetailsPayload = {
  slug: string;
  email: string;
};

export type SaveTheDateDeclinePayload = {
  slug: string;
  email: string;
};
