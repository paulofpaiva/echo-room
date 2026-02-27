import { supabase } from "@/lib/supabase";
import type { Community } from "@/types/community";

export async function fetchCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}
