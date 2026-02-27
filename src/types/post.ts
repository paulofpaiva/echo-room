import type { Community } from "./community";
import type { PostImage } from "./post-image.js";

export interface Post {
  id: string;
  title: string;
  content: string;
  community_id: string;
  anon_fingerprint: string | null;
  country_code: string | null;
  created_at: string;
  updated_at: string;
  community?: Community;
  post_images?: PostImage[];
}
