import { AuditResult, SEOIssue, ActionPlanItem } from "@shared/schema";

export class ExportService {
  generateMarkdownReport(auditResult: AuditResult): string {
    const { url, timestamp, summary, issues, actionPlan, score } = auditResult;
    
    let markdown = `# Rapport d'Audit SEO - ${url}\n\n`;
    markdown += `**Date d'analyse:** ${new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    
    // Score global
    markdown += `## 📊 Score SEO Global\n\n`;
    markdown += `**${score}/100** - ${this.getScoreLabel(score)}\n\n`;
    
    // Résumé
    markdown += `## 📋 Résumé Exécutif\n\n`;
    markdown += `- ✅ **Tests réussis:** ${summary.passed}\n`;
    markdown += `- ⚠️ **Avertissements:** ${summary.warnings}\n`;
    markdown += `- ❌ **Problèmes critiques:** ${summary.critical}\n`;
    markdown += `- 🚀 **Optimisations possibles:** ${summary.optimizations}\n\n`;

    // Problèmes critiques
    const criticalIssues = issues.filter((issue: SEOIssue) => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      markdown += `## 🚨 Problèmes Critiques\n\n`;
      criticalIssues.forEach((issue: SEOIssue) => {
        markdown += `### ${issue.title}\n`;
        markdown += `**Catégorie:** ${issue.category}\n\n`;
        markdown += `${issue.description}\n\n`;
        if (issue.recommendation) {
          markdown += `**Recommandation:** ${issue.recommendation}\n\n`;
        }
        markdown += `---\n\n`;
      });
    }

    // Avertissements
    const warningIssues = issues.filter((issue: SEOIssue) => issue.severity === 'warning');
    if (warningIssues.length > 0) {
      markdown += `## ⚠️ Avertissements\n\n`;
      warningIssues.forEach((issue: SEOIssue) => {
        markdown += `### ${issue.title}\n`;
        markdown += `**Catégorie:** ${issue.category}\n\n`;
        markdown += `${issue.description}\n\n`;
        if (issue.recommendation) {
          markdown += `**Recommandation:** ${issue.recommendation}\n\n`;
        }
        markdown += `---\n\n`;
      });
    }

    // Optimisations
    const optimizationIssues = issues.filter((issue: SEOIssue) => issue.severity === 'optimization');
    if (optimizationIssues.length > 0) {
      markdown += `## 💡 Optimisations Recommandées\n\n`;
      optimizationIssues.forEach((issue: SEOIssue) => {
        markdown += `### ${issue.title}\n`;
        markdown += `**Catégorie:** ${issue.category}\n\n`;
        markdown += `${issue.description}\n\n`;
        if (issue.recommendation) {
          markdown += `**Recommandation:** ${issue.recommendation}\n\n`;
        }
        markdown += `---\n\n`;
      });
    }

    // Plan d'action
    if (actionPlan && actionPlan.length > 0) {
      markdown += `## 📋 Plan d'Action Détaillé\n\n`;
      
      const highPriority = actionPlan.filter((item: ActionPlanItem) => item.priority === 'high');
      const mediumPriority = actionPlan.filter((item: ActionPlanItem) => item.priority === 'medium');
      const lowPriority = actionPlan.filter((item: ActionPlanItem) => item.priority === 'low');

      if (highPriority.length > 0) {
        markdown += `### 🚨 Priorité Haute\n\n`;
        highPriority.forEach((item: ActionPlanItem) => {
          markdown += `- **${item.title}**\n`;
          markdown += `  - ${item.description}\n`;
          markdown += `  - *Délai: ${item.timeframe}*\n`;
          markdown += `  - *Difficulté: ${this.getDifficultyLabel(item.difficulty)}*\n\n`;
        });
      }

      if (mediumPriority.length > 0) {
        markdown += `### ⚠️ Priorité Moyenne\n\n`;
        mediumPriority.forEach((item: ActionPlanItem) => {
          markdown += `- **${item.title}**\n`;
          markdown += `  - ${item.description}\n`;
          markdown += `  - *Délai: ${item.timeframe}*\n`;
          markdown += `  - *Difficulté: ${this.getDifficultyLabel(item.difficulty)}*\n\n`;
        });
      }

      if (lowPriority.length > 0) {
        markdown += `### 💡 Améliorations Long Terme\n\n`;
        lowPriority.forEach((item: ActionPlanItem) => {
          markdown += `- **${item.title}**\n`;
          markdown += `  - ${item.description}\n`;
          markdown += `  - *Délai: ${item.timeframe}*\n`;
          markdown += `  - *Difficulté: ${this.getDifficultyLabel(item.difficulty)}*\n\n`;
        });
      }
    }

    markdown += `---\n\n`;
    markdown += `*Rapport généré par [ShopifyAudit](https://shopifyaudit.com) - Optimisez le SEO de votre boutique Shopify*\n`;

    return markdown;
  }

  private getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Bon niveau';
    if (score >= 60) return 'Moyen';
    if (score >= 40) return 'À améliorer';
    return 'Critique';
  }

  private getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return 'Moyen';
    }
  }

  generateFileName(url: string, format: string): string {
    const cleanUrl = url.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    return `audit-seo-${cleanUrl}-${timestamp}.${format}`;
  }
}

export const exportService = new ExportService();
