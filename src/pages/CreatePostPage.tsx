import { useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { useCommunities } from "@/hooks/useCommunities";
import { useCreatePostForm } from "@/hooks/useCreatePostForm";
import { usePostImageList } from "@/hooks/usePostImageList";
import { PostImageSortableList } from "@/components/post/PostImageSortableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPostSchema, type CreatePostFormValues } from "@/schemas/createPost";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 3;
const ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

export function CreatePostPage() {
  const { slug } = useParams<{ slug: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: communities } = useCommunities();
  const communityExists = communities?.some((c) => c.slug === slug) ?? false;

  const form = useCreatePostForm(slug);
  const imageList = usePostImageList({
    maxImages: MAX_IMAGES,
    accept: ACCEPT,
    maxSizeBytes: 5 * 1024 * 1024,
  });

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = (data: CreatePostFormValues) => {
    form.submit(data, imageList.imageFiles).catch(() => {});
  };

  const openFilePicker = () => {
    if (imageList.imageItems.length >= MAX_IMAGES) return;
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      imageList.addFiles(Array.from(files));
      e.target.value = "";
    }
  };

  if (!slug) return <Navigate to="/" replace />;
  if (communities && !communityExists) return <Navigate to="/" replace />;

  return (
    <div className="space-y-6">
      <BackLink />

      <h1 className="text-2xl font-semibold">New post in /c/{slug}</h1>

      <form onSubmit={rhfHandleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Post title"
            maxLength={500}
            className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            {...register("content")}
            rows={6}
            placeholder="Write your post..."
            className={cn(
              "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              errors.content && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={imageList.acceptString}
            multiple
            className="hidden"
            onChange={onFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={openFilePicker}
            disabled={imageList.imageItems.length >= MAX_IMAGES}
            aria-label="Add images"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>

          {imageList.imageItems.length > 0 && (
            <PostImageSortableList
              imageItems={imageList.imageItems}
              onRemove={imageList.removeImage}
              sensors={imageList.sensors}
              onDragEnd={imageList.handleDragEnd}
            />
          )}
        </div>

        {form.isError && (
          <p className="text-sm text-destructive">
            {form.error instanceof Error ? form.error.message : "Failed to create post"}
          </p>
        )}

        <Button type="submit" disabled={form.isPending}>
          {form.isPending ? "Posting…" : "Post"}
        </Button>
      </form>
    </div>
  );
}
