import { supabase } from "@/lib/supabase";

const BUCKET = "post-images";

function getExtension(file: File): string {
  const mime = file.type;
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/gif") return "gif";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export interface CreatePostParams {
  title: string;
  content: string;
  communitySlug: string;
  anonFingerprint: string | null;
  imageFiles: File[];
}

export async function createPost(params: CreatePostParams): Promise<{ id: string }> {
  const { title, content, communitySlug, anonFingerprint, imageFiles } = params;
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) throw new Error("Missing Supabase env");

  const image_paths: string[] = [];
  if (imageFiles.length > 0) {
    const folder = crypto.randomUUID();
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const ext = getExtension(file);
      const path = `${folder}/${i + 1}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      image_paths.push(path);
    }
  }

  const url = `${baseUrl}/functions/v1/create-post`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      title: title.trim(),
      content: content.trim(),
      community_slug: communitySlug.trim(),
      anon_fingerprint: anonFingerprint || null,
      image_paths,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? res.statusText);
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}
