export type ReportTargetType = "post" | "comment" | "news_comment";

export interface CreateReportParams {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  anonFingerprint: string | null;
}
