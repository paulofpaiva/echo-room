export type SearchOrder = "newest" | "oldest" | "most_commented";

export interface SearchPostResult {
  post_id: string;
  title: string;
  content_preview: string;
  community_slug: string;
  created_at: string;
  comment_count: number;
}
