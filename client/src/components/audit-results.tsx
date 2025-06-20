import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight,
  RefreshCw,
  Clock,
  TrendingUp
} from "lucide-react";
import { AuditResult, SEOIssue, ActionPlanItem } from "@shared/schema";
import { ExportOptions } from "./export-options";

interface AuditResultsProps {
  auditResult: AuditResult;
  onNewAudit: () => void;
}

export function AuditResults({ auditResult, onNewAudit }: AuditResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Bon niveau";
    if (score >= 60) return "Moyen";
    if (score >= 40) return "À améliorer";
    return "Critique";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'optimization':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "destructive";
      case 'warning':
        return "secondary";
      case 'optimization':
        return "outline";
      default:
        return "secondary";
    }
  };

  const criticalIssues = auditResult.issues.filter((issue: SEOIssue) => issue.severity === 'critical');
  const warningIssues = auditResult.issues.filter((issue: SEOIssue) => issue.severity === 'warning');
  const optimizationIssues = auditResult.issues.filter((issue: SEOIssue) => issue.severity === 'optimization');

  const highPriorityItems = auditResult.actionPlan.filter((item: ActionPlanItem) => item.priority === 'high');
  const mediumPriorityItems = auditResult.actionPlan.filter((item: ActionPlanItem) => item.priority === 'medium');
  const lowPriorityItems = auditResult.actionPlan.filter((item: ActionPlanItem) => item.priority === 'low');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Résultats de l'audit
          </h3>
          <p className="text-slate-600 dark:text-slate-300">{auditResult.url}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{new Date(auditResult.timestamp).toLocaleString('fr-FR')}</span>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Score SEO Global</span>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(auditResult.score)}`}>
                      {auditResult.score}/100
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {getScoreLabel(auditResult.score)}
                    </div>
                  </div>
                  <TrendingUp className={`w-6 h-6 ${getScoreColor(auditResult.score)}`} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {auditResult.summary.passed}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Tests réussis
                  </div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {auditResult.summary.warnings}
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                    Avertissements
                  </div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {auditResult.summary.critical}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                    Critiques
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {auditResult.summary.optimizations}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Optimisations
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <ExportOptions auditResult={auditResult} />
      </div>

      {/* Issues Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-red-600 dark:text-red-400">Problèmes Critiques</span>
                <Badge variant="destructive">
                  {criticalIssues.length} problème{criticalIssues.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <h5 className="font-medium text-red-900 dark:text-red-100 text-sm">
                        {issue.title}
                      </h5>
                      <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                        {issue.description}
                      </p>
                      {issue.recommendation && (
                        <p className="text-red-600 dark:text-red-400 text-xs mt-2 font-medium">
                          💡 {issue.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Optimization Recommendations */}
        {optimizationIssues.length > 0 && (
          <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-blue-600 dark:text-blue-400">Optimisations Recommandées</span>
                <Badge variant="outline">
                  {optimizationIssues.length} amélioration{optimizationIssues.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizationIssues.slice(0, 3).map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                        {issue.title}
                      </h5>
                      <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                ))}
                {optimizationIssues.length > 3 && (
                  <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    et {optimizationIssues.length - 3} autre{optimizationIssues.length - 3 > 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Plan */}
      {auditResult.actionPlan && auditResult.actionPlan.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Plan d'Action Détaillé</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('actionPlan')}
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                {expandedSection === 'actionPlan' ? 'Masquer' : 'Voir tout'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* High Priority */}
              {highPriorityItems.length > 0 && (
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-slate-900 dark:text-white">
                      🚨 Priorité Haute
                    </h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      À faire immédiatement
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {highPriorityItems.slice(0, expandedSection === 'actionPlan' ? undefined : 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medium Priority */}
              {mediumPriorityItems.length > 0 && (expandedSection === 'actionPlan' || highPriorityItems.length === 0) && (
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-slate-900 dark:text-white">
                      ⚠️ Priorité Moyenne
                    </h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      À faire sous 2 semaines
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {mediumPriorityItems.slice(0, expandedSection === 'actionPlan' ? undefined : 2).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Low Priority */}
              {lowPriorityItems.length > 0 && expandedSection === 'actionPlan' && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-slate-900 dark:text-white">
                      💡 Améliorations Long Terme
                    </h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Optimisations
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {lowPriorityItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Audit Button */}
      <div className="text-center">
        <Button
          onClick={onNewAudit}
          className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Nouvel audit
        </Button>
      </div>
    </div>
  );
}
