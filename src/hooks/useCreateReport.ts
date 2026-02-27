import { useMutation } from "@tanstack/react-query";
import { createReport } from "@/services/createReport";
import type { CreateReportParams } from "@/types/report";

export function useCreateReport() {
  return useMutation({
    mutationFn: (params: CreateReportParams) => createReport(params),
  });
}
