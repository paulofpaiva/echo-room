export interface News {
  id: string;
  external_id: string | null;
  source: string | null;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
}
