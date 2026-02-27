import { supabase } from "@/lib/supabase";
import type { Community } from "@/types/community";

const DEFAULT_LIMIT = 50;

export async function fetchCommunities(limit?: number): Promise<Community[]> {
  let q = supabase.from("communities").select("*").order("name");
  if (limit != null && limit > 0) {
    q = q.limit(limit);
  }
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function searchCommunities(query: string): Promise<Community[]> {
  const q = (query ?? "").trim();
  if (q === "") return fetchCommunities(DEFAULT_LIMIT);
  const { data, error } = await supabase.rpc("search_communities", {
    p_query: q,
  });
  if (error) throw error;
  return (data ?? []) as Community[];
}
