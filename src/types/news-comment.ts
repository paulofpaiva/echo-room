export interface NewsComment {
  id: string;
  news_id: string;
  parent_id: string | null;
  content: string;
  anon_fingerprint: string | null;
  country_code: string | null;
  created_at: string;
}
