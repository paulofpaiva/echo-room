/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ESM URL resolved at runtime by Deno
// @ts-expect-error -- ESM URL resolved at runtime by Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCountryCodeFromRequest } from "../_shared/country.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CreateNewsCommentBody {
  news_id: string;
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
    const body = (await req.json()) as CreateNewsCommentBody;
    const { news_id, parent_id, content, anon_fingerprint, country_code } = body;

    if (!news_id?.trim() || !content?.trim()) {
      return new Response(
        JSON.stringify({ error: "news_id and content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const env = Deno.env as { get(key: string): string | undefined };
    const supabase = createClient(
      env.get("SUPABASE_URL")!,
      env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: news, error: newsError } = await supabase
      .from("news")
      .select("id")
      .eq("id", news_id.trim())
      .single();

    if (newsError || !news) {
      return new Response(
        JSON.stringify({ error: "News not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parentId = parent_id?.trim() || null;
    if (parentId) {
      const { data: parent, error: parentError } = await supabase
        .from("news_comments")
        .select("id")
        .eq("id", parentId)
        .eq("news_id", news_id.trim())
        .single();
      if (parentError || !parent) {
        return new Response(
          JSON.stringify({ error: "Parent comment not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const resolvedCountryCode =
      normalizeCountryCode(country_code) ?? (await getCountryCodeFromRequest(req));
    const insertRow = {
      news_id: news_id.trim(),
      parent_id: parentId,
      content: content.trim(),
      anon_fingerprint: anon_fingerprint?.trim() || null,
      country_code: resolvedCountryCode,
    };

    const { data: comment, error: insertError } = await supabase
      .from("news_comments")
      .insert(insertRow)
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
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method === "POST") {
    return handlePost(req);
  }
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
});
