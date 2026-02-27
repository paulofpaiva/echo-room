import { Link } from "react-router-dom";
import { useLatestPostImages } from "@/hooks/useLatestPostImages";
import { supabase } from "@/lib/supabase";
import type { LatestPostImage } from "@/services/homePosts";

const BUCKET = "post-images";
const LIMIT = 4; // 2 rows × 2 images

function LatestImageCard({ item }: { item: LatestPostImage }) {
  const slug = item.post?.community?.slug ?? "";
  const postUrl = `/c/${slug}/post/${item.post_id}`;
  const imageUrl = supabase.storage.from(BUCKET).getPublicUrl(item.storage_path).data.publicUrl;

  return (
    <Link
      to={postUrl}
      className="block aspect-square w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-muted transition-colors hover:border-border hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img
        src={imageUrl}
        alt=""
        className="h-full w-full object-cover"
      />
    </Link>
  );
}

export function LatestImagesSection() {
  const { data: items = [], isLoading } = useLatestPostImages(LIMIT);
  const displayItems = items.slice(0, 4);

  if (isLoading || displayItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 max-w-[8rem]">
      {displayItems.map((item) => (
        <LatestImageCard key={item.id} item={item} />
      ))}
    </div>
  );
}
