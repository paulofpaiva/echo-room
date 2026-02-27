import { Link } from "react-router-dom";
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
      <h2 className="text-lg font-semibold mb-2">Communities</h2>
      <ul className="list-none border rounded-md divide-y divide-border">
        {(communities ?? []).map((community) => (
          <li key={community.id}>
            <Link
              to={`/c/${community.slug}`}
              className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <span>/c/{community.slug}</span>
              <span className="text-muted-foreground">
                ({postCounts[community.id] ?? 0})
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
