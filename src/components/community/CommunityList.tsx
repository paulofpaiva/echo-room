import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import type { Community } from "@/types/community";

interface CommunityListProps {
  communities: Community[];
  postCounts: Record<string, number>;
}

export function CommunityList({
  communities,
  postCounts,
}: CommunityListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-1.5">
          <LayoutGrid className="h-5 w-5 text-primary shrink-0" aria-hidden />
          Communities
        </h2>
        <Link
          to="/communities"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View more
        </Link>
      </div>
      <ul className="list-none columns-2 sm:columns-3 gap-x-4 gap-y-0.5">
        {(communities ?? []).map((community) => (
          <li key={community.id} className="break-inside-avoid py-0.5">
            <Link
              to={`/c/${community.slug}`}
              className="text-sm text-primary hover:underline"
            >
              /c/{community.slug}
              <span className="text-muted-foreground font-normal">
                {" "}({postCounts[community.id] ?? 0})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
