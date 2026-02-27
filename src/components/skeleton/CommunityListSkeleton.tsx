import { LayoutGrid } from "lucide-react";
import { Skeleton } from "./Skeleton";

const PLACEHOLDER_ITEMS = 4;

interface CommunityListSkeletonProps {
  showHeader?: boolean;
  variant?: "columns" | "list";
}

export function CommunityListSkeleton({
  showHeader = true,
  variant = "columns",
}: CommunityListSkeletonProps) {
  return (
    <div>
      {showHeader && (
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-1.5">
          <LayoutGrid className="h-5 w-5 text-primary shrink-0" aria-hidden />
          Communities
        </h2>
      )}
      {variant === "columns" ? (
        <ul className="list-none columns-2 sm:columns-3 gap-x-4 gap-y-0.5">
          {Array.from({ length: PLACEHOLDER_ITEMS }).map((_, i) => (
            <li key={i} className="break-inside-avoid py-0.5">
              <Skeleton className="h-4 w-20 inline-block" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list-none border rounded-md divide-y divide-border">
          {Array.from({ length: PLACEHOLDER_ITEMS }).map((_, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
