import { z } from "zod";

const CONTENT_MAX = 10_000;

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(CONTENT_MAX, `Comment must be at most ${CONTENT_MAX} characters`),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
