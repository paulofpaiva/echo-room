import { Link, useParams, Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePost } from "@/hooks/usePost";
import { CommentList } from "@/components/comment/CommentList";

export function PostDetailPage() {
  const { slug, postId } = useParams<{ slug: string; postId: string }>();

  const { data: post, isLoading, isError, error } = usePost(postId);

  if (!slug || !postId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Loading post…</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Post not found."}
        </p>
        <Link to={`/c/${slug}`} className="text-primary text-sm underline">
          ← Back to /c/{slug}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to={`/c/${slug}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to /c/{slug}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            {new Date(post.created_at).toLocaleString()} · ↑ {post.upvotes} ↓{" "}
            {post.downvotes}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <CommentList postId={post.id} />
      </section>
    </div>
  );
}
