import { Skeleton } from "./Skeleton";

const PLACEHOLDER_ITEMS = 5;

export function CommunityListSkeleton() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Communities</h2>
      <ul className="list-none border rounded-md divide-y divide-border">
        {Array.from({ length: PLACEHOLDER_ITEMS }).map((_, i) => (
          <li key={i} className="flex items-center justify-between px-3 py-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </li>
        ))}
      </ul>
    </div>
  );
}
