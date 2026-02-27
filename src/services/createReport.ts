import type { CreateReportParams } from "@/types/report";

export async function createReport(params: CreateReportParams): Promise<void> {
  const { targetType, targetId, reason, anonFingerprint } = params;
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) throw new Error("Missing Supabase env");

  const url = `${baseUrl}/functions/v1/create-report`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      target_type: targetType,
      target_id: targetId.trim(),
      reason: reason.trim(),
      anon_fingerprint: anonFingerprint || null,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? res.statusText);
  }
}
