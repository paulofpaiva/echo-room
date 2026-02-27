export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  content: string;
  anon_fingerprint: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
}
