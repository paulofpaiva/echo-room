export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  content: string;
  anon_fingerprint: string | null;
  created_at: string;
}
