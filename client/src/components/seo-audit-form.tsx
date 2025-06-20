import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Zap, Globe, ArrowRight, Loader2 } from "lucide-react";
import { useAudit } from "@/hooks/use-audit";
import { AuditResult } from "@shared/schema";

interface SEOAuditFormProps {
  onAuditComplete: (result: AuditResult) => void;
  onAuditStart: () => void;
  prefilledUrl?: string;
  autoStart?: boolean;
}

export function SEOAuditForm({ 
  onAuditComplete, 
  onAuditStart, 
  prefilledUrl = "", 
  autoStart = false 
}: SEOAuditFormProps) {
  const [url, setUrl] = useState(prefilledUrl);
  const [error, setError] = useState<string | null>(null);
  const { auditUrl, isAuditing, auditError, auditResult, reset } = useAudit();

  // Auto-start audit if URL is pre-filled
  useEffect(() => {
    if (autoStart && prefilledUrl && !isAuditing) {
      handleSubmit();
    }
  }, [autoStart, prefilledUrl]);

  // Handle successful audit
  useEffect(() => {
    if (auditResult) {
      onAuditComplete(auditResult);
    }
  }, [auditResult, onAuditComplete]);

  // Handle audit error
  useEffect(() => {
    if (auditError) {
      setError(auditError.message || 'Une erreur est survenue lors de l\'audit');
    }
  }, [auditError]);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Veuillez saisir une URL");
      return;
    }

    // Validation URL
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      setUrl(urlObj.href);
    } catch {
      setError("URL invalide. Exemple: maboutique.myshopify.com");
      return;
    }

    setError(null);
    onAuditStart();
    
    auditUrl({ 
      url: url.startsWith('http') ? url : `https://${url}` 
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Audit Gratuit & Instantané
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Analysez votre boutique Shopify
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Identifiez les problèmes SEO qui limitent votre visibilité et obtenez un plan d'action détaillé
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="url"
                placeholder="monboutique.myshopify.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-3 text-base border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500"
                disabled={isAuditing}
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isAuditing || !url.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 text-base transition-all transform hover:scale-[1.02] shadow-lg"
              size="lg"
            >
              {isAuditing ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Lancer l'audit SEO gratuit
                </div>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span>Aucune donnée personnelle collectée</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
