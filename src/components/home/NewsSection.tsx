import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { useNewsForHome } from "@/hooks/useNewsForHome";
import { NewsCardCompact } from "@/components/news/NewsCardCompact";
import { NewsCarouselSkeleton } from "./NewsCarouselSkeleton";
import { Button } from "@/components/ui/button";

export function NewsSection() {
  const { data: items = [], isLoading, isError } = useNewsForHome();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollButtons();
    emblaApi.on("select", updateScrollButtons);
    emblaApi.on("reInit", updateScrollButtons);
    return () => {
      emblaApi.off("select", updateScrollButtons);
      emblaApi.off("reInit", updateScrollButtons);
    };
  }, [emblaApi, updateScrollButtons]);

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
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 -ml-3 touch-pan-y">
              {items.map((news) => (
                <NewsCardCompact key={news.id} news={news} />
              ))}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 h-8 w-8 rounded-full border border-border bg-background/95 shadow-sm"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous news"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 h-8 w-8 rounded-full border border-border bg-background/95 shadow-sm"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next news"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
