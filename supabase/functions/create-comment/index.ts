/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ESM URL resolved at runtime by Deno
// @ts-expect-error -- ESM URL resolved at runtime by Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCommentBody {
  post_id: string;
  parent_id?: string | null;
  content: string;
  anon_fingerprint?: string | null;
  country_code?: string | null;
}

function normalizeCountryCode(value: unknown): string | null {
  if (value == null || typeof value !== "string") return null;
  const s = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(s) ? s : null;
}

async function handlePost(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as CreateCommentBody;
    const { post_id, parent_id, content, anon_fingerprint, country_code } = body;

    if (!post_id?.trim() || !content?.trim()) {
      return new Response(
        JSON.stringify({ error: "post_id and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const env = Deno.env as { get(key: string): string | undefined };
    const supabase = createClient(
      env.get("SUPABASE_URL")!,
      env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", post_id.trim())
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parentId = parent_id?.trim() || null;
    if (parentId) {
      const { data: parent, error: parentError } = await supabase
        .from("comments")
        .select("id")
        .eq("id", parentId)
        .eq("post_id", post_id.trim())
        .single();
      if (parentError || !parent) {
        return new Response(
          JSON.stringify({ error: "Parent comment not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { data: comment, error: insertError } = await supabase
      .from("comments")
      .insert({
        post_id: post_id.trim(),
        parent_id: parentId,
        content: content.trim(),
        anon_fingerprint: anon_fingerprint?.trim() || null,
        country_code: normalizeCountryCode(country_code),
      })
      .select("id")
      .single();

    if (insertError || !comment) {
      return new Response(
        JSON.stringify({ error: insertError?.message ?? "Failed to create comment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ id: comment.id }),
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
