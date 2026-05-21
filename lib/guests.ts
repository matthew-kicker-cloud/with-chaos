import { createServerSupabaseClient } from "@/lib/supabase";
import { Guest } from "@/lib/types";

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("guests").select("*").eq("slug", slug).maybeSingle<Guest>();
  if (error) {
    throw error;
  }
  return data;
}

export async function getAllGuests(): Promise<Guest[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("guests").select("*").order("created_at", { ascending: true });
  if (error) {
    throw error;
  }
  return data as Guest[];
}
