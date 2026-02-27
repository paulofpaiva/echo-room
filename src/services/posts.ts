import { supabase } from "@/lib/supabase";
import type { Post } from "@/types/post";

const PAGE_SIZE = 10;

/** Fetches a single page (for useInfiniteQuery). Requests one extra to know hasMore. */
export async function fetchPostsByCommunityPage(
  communitySlug: string,
  page: number
): Promise<{ posts: Post[]; hasMore: boolean }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE; // request PAGE_SIZE+1 items

  const { data, error } = await supabase
    .from("posts")
    .select("*, community:communities!inner(*), post_images(*)")
    .eq("community.slug", communitySlug)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  const raw = (data ?? []) as Post[];
  const hasMore = raw.length > PAGE_SIZE;
  const posts = hasMore ? raw.slice(0, PAGE_SIZE) : raw;
  return { posts, hasMore };
}

export async function fetchPostById(postId: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, community:communities(*), post_images(*)")
    .eq("id", postId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Post;
}
