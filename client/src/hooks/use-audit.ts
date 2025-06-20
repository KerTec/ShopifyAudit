import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AuditResult, AuditRequest } from "@shared/schema";

export function useAudit() {
  const queryClient = useQueryClient();

  const auditMutation = useMutation({
    mutationFn: async (data: AuditRequest): Promise<AuditResult> => {
      const response = await apiRequest("POST", "/api/audit", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Cache the result
      queryClient.setQueryData(['audit', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['audits', 'recent'] });
    },
  });

  return {
    auditUrl: auditMutation.mutate,
    isAuditing: auditMutation.isPending,
    auditError: auditMutation.error,
    auditResult: auditMutation.data,
    reset: auditMutation.reset,
  };
}

export function useRecentAudits() {
  return useQuery({
    queryKey: ['audits', 'recent'],
    queryFn: async (): Promise<AuditResult[]> => {
      const response = await fetch('/api/audits/recent');
      if (!response.ok) throw new Error('Failed to fetch recent audits');
      return response.json();
    },
  });
}

export function useExportMarkdown() {
  return useMutation({
    mutationFn: async (auditId: number) => {
      const response = await apiRequest("POST", "/api/export/markdown", { auditId });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'audit.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

export function useExportJSON() {
  return useMutation({
    mutationFn: async (auditId: number) => {
      const response = await apiRequest("POST", "/api/export/json", { auditId });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'audit.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}
