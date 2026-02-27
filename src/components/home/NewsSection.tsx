import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Newspaper } from "lucide-react";
import { useNewsForHome } from "@/hooks/useNewsForHome";
import { NewsCardCompact } from "@/components/news/NewsCardCompact";
import { NewsCarouselSkeleton } from "./NewsCarouselSkeleton";

export function NewsSection() {
  const { data: items = [], isLoading, isError } = useNewsForHome();
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-1.5">
          <Newspaper className="h-5 w-5 text-primary shrink-0" aria-hidden />
          News
        </h2>
        <Link
          to="/news"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View more
        </Link>
      </div>
      {isError ? (
        <p className="text-sm text-muted-foreground">Failed to load news.</p>
      ) : isLoading ? (
        <NewsCarouselSkeleton />
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No news yet. Run the sync to fetch headlines.
        </p>
      ) : (
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 -ml-3 touch-pan-y">
            {items.map((news) => (
              <NewsCardCompact key={news.id} news={news} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
