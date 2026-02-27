/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ESM URL resolved at runtime by Deno
// @ts-expect-error -- ESM URL resolved at runtime by Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsApiArticle {
  source?: { id?: string; name?: string };
  author?: string;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
}

interface NewsApiResponse {
  status?: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
}

function parsePublishedAt(s: string | undefined): string | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

async function handleSync(req: Request): Promise<Response> {
  try {
    const env = Deno.env as { get(key: string): string | undefined };
    const apiKey = env.get("NEWS_API_KEY");
    if (!apiKey?.trim()) {
      return new Response(
        JSON.stringify({ error: "NEWS_API_KEY is not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // NewsAPI free tier often returns 0 articles for country=br; default to "us" so sync has content
    const reqUrl = new URL(req.url);
    const country = (reqUrl.searchParams.get("country") ?? "us").toLowerCase().slice(0, 2);
    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.set("country", country);
    url.searchParams.set("pageSize", "20");
    url.searchParams.set("apiKey", apiKey.trim());

    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: `NewsAPI error: ${res.status}`, details: text.slice(0, 200) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = (await res.json()) as NewsApiResponse;
    if (data.status !== "ok" || !Array.isArray(data.articles)) {
      return new Response(
        JSON.stringify({ error: "Invalid NewsAPI response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const totalFromApi = data.articles.length;
    const rows = data.articles
      .filter((a) => a?.url?.trim() && a?.title?.trim())
      .map((a) => ({
        external_id: a.source?.id ?? null,
        source: (a.source?.name ?? "").trim() || null,
        title: (a.title ?? "").trim(),
        description: (a.description ?? "").trim() || null,
        url: (a.url ?? "").trim(),
        image_url: (a.urlToImage ?? "").trim() || null,
        published_at: parsePublishedAt(a.publishedAt),
      }));

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({
          ok: true,
          upserted: 0,
          hint: totalFromApi === 0
            ? `NewsAPI returned 0 articles for country=${country}. Try invoking with ?country=us to test (e.g. .../sync-news?country=us), or check NewsAPI plan limits for your region.`
            : "All articles were filtered out (missing url or title).",
          totalFromApi,
          country,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(env.get("SUPABASE_URL")!, env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error } = await supabase.from("news").upsert(rows, {
      onConflict: "url",
      ignoreDuplicates: false,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, upserted: rows.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
  if (req.method === "POST" || req.method === "GET") {
    return handleSync(req);
  }
  return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
});
