/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ESM URL resolved at runtime by Deno
// @ts-expect-error -- ESM URL resolved at runtime by Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreatePostBody {
  title: string;
  content: string;
  community_slug: string;
  anon_fingerprint?: string | null;
  image_paths?: string[];
}

async function handlePost(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as CreatePostBody;
    const { title, content, community_slug, anon_fingerprint, image_paths } = body;

    if (!title?.trim() || !content?.trim() || !community_slug?.trim()) {
      return new Response(
        JSON.stringify({ error: "title, content and community_slug are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const env = Deno.env as { get(key: string): string | undefined };
    const supabase = createClient(
      env.get("SUPABASE_URL")!,
      env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: community, error: communityError } = await supabase
      .from("communities")
      .select("id")
      .eq("slug", community_slug.trim())
      .single();

    if (communityError || !community) {
      return new Response(
        JSON.stringify({ error: "Community not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        community_id: community.id,
        anon_fingerprint: anon_fingerprint?.trim() || null,
      })
      .select("id")
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: postError?.message ?? "Failed to create post" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paths = Array.isArray(image_paths) ? image_paths.slice(0, 3) : [];
    if (paths.length > 0) {
      const rows = paths.map((storage_path, i) => ({
        post_id: post.id,
        storage_path,
        display_order: i + 1,
      }));
      const { error: imagesError } = await supabase.from("post_images").insert(rows);
      if (imagesError) {
        return new Response(
          JSON.stringify({ error: imagesError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ id: post.id }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method === "POST") {
    return handlePost(req);
  }
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
});
