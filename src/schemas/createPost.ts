import { z } from "zod";

const TITLE_MAX = 500;
const CONTENT_MAX = 50_000;

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`),
  content: z
    .string()
    .min(1, "Content is required")
    .max(CONTENT_MAX, `Content must be at most ${CONTENT_MAX} characters`),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
