import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Community } from "@/types/community";

interface CommunityCardProps {
  community: Community;
  postCount: number;
}

export function CommunityCard({ community, postCount }: CommunityCardProps) {
  return (
    <Link to={`/c/${community.slug}`}>
      <Card className="transition-colors hover:bg-muted/50 cursor-pointer h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">/c/{community.slug}</CardTitle>
          <CardDescription className="line-clamp-2">
            {community.description ?? community.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {community.name}
            {" · "}
            {postCount} post{postCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
