import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, FileText, Code, FileImage, Check, Loader2 } from "lucide-react";
import { AuditResult } from "@shared/schema";
import { useExportMarkdown, useExportJSON } from "@/hooks/use-audit";
import { copyToClipboard, generateClipboardSummary } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";
import { PremiumExport } from "./premium-export";

interface ExportOptionsProps {
  auditResult: AuditResult;
}

export function ExportOptions({ auditResult }: ExportOptionsProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const exportMarkdown = useExportMarkdown();
  const exportJSON = useExportJSON();

  const handleCopy = async (type: string, text: string) => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers",
      });
      
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive",
      });
    }
  };

  const handleMarkdownExport = () => {
    exportMarkdown.mutate(auditResult.id, {
      onSuccess: () => {
        toast({
          title: "Export réussi",
          description: "Le rapport Markdown a été téléchargé",
        });
      },
      onError: () => {
        toast({
          title: "Erreur d'export",
          description: "Impossible d'exporter le rapport Markdown",
          variant: "destructive",
        });
      },
    });
  };

  const handleJSONExport = () => {
    exportJSON.mutate(auditResult.id, {
      onSuccess: () => {
        toast({
          title: "Export réussi",
          description: "Les données JSON ont été téléchargées",
        });
      },
      onError: () => {
        toast({
          title: "Erreur d'export",
          description: "Impossible d'exporter les données JSON",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
          Exports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Free exports */}
        <Button
          onClick={handleMarkdownExport}
          disabled={exportMarkdown.isPending}
          variant="outline"
          className="w-full flex items-center justify-between p-3 h-auto hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <div className="flex items-center">
            {exportMarkdown.isPending ? (
              <Loader2 className="w-4 h-4 mr-3 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Markdown
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            GRATUIT
          </span>
        </Button>
        
        <Button
          onClick={handleJSONExport}
          disabled={exportJSON.isPending}
          variant="outline"
          className="w-full flex items-center justify-between p-3 h-auto hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <div className="flex items-center">
            {exportJSON.isPending ? (
              <Loader2 className="w-4 h-4 mr-3 animate-spin" />
            ) : (
              <Code className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              JSON
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            GRATUIT
          </span>
        </Button>
        
        <Button
          onClick={() => handleCopy('summary', generateClipboardSummary(auditResult))}
          variant="outline"
          className="w-full flex items-center justify-between p-3 h-auto hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <div className="flex items-center">
            {copiedStates.summary ? (
              <Check className="w-4 h-4 mr-3 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 mr-3 text-slate-600 dark:text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Copier
            </span>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            GRATUIT
          </span>
        </Button>
        
        {/* Premium export */}
        <div className="border-t border-slate-200 dark:border-slate-600 pt-3 mt-3">
          <PremiumExport auditResult={auditResult} />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            Rapport professionnel complet avec recommandations détaillées
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
