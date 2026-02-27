import { supabase } from "@/lib/supabase";
import type { Post } from "@/types/post";

const DEFAULT_LIMIT = 10;

export interface LatestPostImage {
  id: string;
  post_id: string;
  storage_path: string;
  created_at: string;
  post: {
    id: string;
    community: { slug: string } | null;
  } | null;
}

/** Fetches latest post images across all communities for the home page. */
export async function fetchLatestPostImages(
  limit: number = 12
): Promise<LatestPostImage[]> {
  const { data, error } = await supabase
    .from("post_images")
    .select(
      "id, post_id, storage_path, created_at, post:posts!inner(id, community:communities!inner(slug))"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as LatestPostImage[];
}

/** Fetches latest posts across all communities for the home page. */
export async function fetchLatestPosts(
  limit: number = DEFAULT_LIMIT
): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, community:communities!inner(*), post_images(*)")
    .order("created_at", { ascending: false })
    .order("display_order", { ascending: true, foreignTable: "post_images" })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Post[];
}

export interface MostCommentedResult {
  posts: Post[];
  commentCounts: Record<string, number>;
}

/** Fetches most commented posts and their comment counts for the home page. */
export async function fetchMostCommentedPosts(
  limit: number = DEFAULT_LIMIT
): Promise<MostCommentedResult> {
  const { data: rows, error: rpcError } = await supabase.rpc(
    "get_most_commented_post_ids",
    { p_limit: limit }
  );

  if (rpcError) throw rpcError;
  const orderedRows = (rows ?? []) as { post_id: string; comment_count: number }[];
  if (orderedRows.length === 0) return { posts: [], commentCounts: {} };

  const ids = orderedRows.map((r) => r.post_id);
  const commentCounts: Record<string, number> = {};
  for (const r of orderedRows) {
    commentCounts[r.post_id] = Number(r.comment_count);
  }

  const { data: posts, error: fetchError } = await supabase
    .from("posts")
    .select("*, community:communities(*), post_images(*)")
    .in("id", ids)
    .order("display_order", { ascending: true, foreignTable: "post_images" });

  if (fetchError) throw fetchError;
  const byId = new Map<string, Post>();
  for (const p of (posts ?? []) as Post[]) {
    byId.set(p.id, p);
  }
  const postsOrdered = ids.map((id) => byId.get(id)).filter(Boolean) as Post[];
  return { posts: postsOrdered, commentCounts };
}
