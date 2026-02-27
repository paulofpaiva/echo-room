import { Link } from "react-router-dom";
import { useCommunities } from "@/hooks/useCommunities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomePage() {
  const { data: communities, isLoading, isError, error } = useCommunities();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Communities</h1>
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Communities</h1>
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load communities."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Communities</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(communities ?? []).map((community) => (
          <Link key={community.id} to={`/c/${community.slug}`}>
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
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
