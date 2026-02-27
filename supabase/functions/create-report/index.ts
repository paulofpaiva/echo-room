/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ESM URL resolved at runtime by Deno
// @ts-expect-error -- ESM URL resolved at runtime by Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REPORT_TYPES = ["post", "comment", "news_comment"] as const;
const REPORT_REASON_MAX_LENGTH = 500;
const MAX_REPORTS_PER_HOUR = 10;

interface CreateReportBody {
  target_type: "post" | "comment" | "news_comment";
  target_id: string;
  reason: string;
  anon_fingerprint?: string | null;
}

function isValidReportType(value: unknown): value is (typeof REPORT_TYPES)[number] {
  return typeof value === "string" && REPORT_TYPES.includes(value as (typeof REPORT_TYPES)[number]);
}

async function handlePost(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as CreateReportBody;
    const { target_type, target_id, reason, anon_fingerprint } = body;

    if (!isValidReportType(target_type)) {
      return new Response(
        JSON.stringify({ error: "target_type must be post, comment, or news_comment" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedReason = reason?.trim();
    if (!trimmedReason || trimmedReason.length > REPORT_REASON_MAX_LENGTH) {
      return new Response(
        JSON.stringify({ error: "reason is required and must be at most 500 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const env = Deno.env as { get(key: string): string | undefined };
    const supabase = createClient(
      env.get("SUPABASE_URL")!,
      env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const fingerprint = anon_fingerprint?.trim() || null;

    if (fingerprint) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count, error: countError } = await supabase
        .from("rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("anon_fingerprint", fingerprint)
        .eq("action", "report")
        .gte("created_at", oneHourAgo);

      if (!countError && (count ?? 0) >= MAX_REPORTS_PER_HOUR) {
        return new Response(
          JSON.stringify({ error: "Too many reports. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const targetId = target_id?.trim();
    if (!targetId) {
      return new Response(
        JSON.stringify({ error: "target_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const table =
      target_type === "post"
        ? "posts"
        : target_type === "comment"
          ? "comments"
          : "news_comments";
    const { data: target, error: targetError } = await supabase
      .from(table)
      .select("id")
      .eq("id", targetId)
      .single();

    if (targetError || !target) {
      return new Response(
        JSON.stringify({ error: "Target not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: insertError } = await supabase.from("reports").insert({
      target_type,
      target_id: targetId,
      anon_fingerprint: fingerprint,
      reason: trimmedReason,
    });

    if (fingerprint) {
      await supabase.from("rate_limits").insert({
        anon_fingerprint: fingerprint,
        action: "report",
      });
    }

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
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
