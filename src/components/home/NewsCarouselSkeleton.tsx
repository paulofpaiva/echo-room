const SLIDE_COUNT = 5;

export function NewsCarouselSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-3 -ml-3">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_45%] min-w-0 rounded-lg border border-border/60 bg-card overflow-hidden animate-pulse"
          >
            <div className="aspect-video w-full bg-muted" />
            <div className="p-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="mt-1 h-4 w-4/5 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
