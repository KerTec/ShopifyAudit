import { AuditResult, SEOIssue, ActionPlanItem } from "@shared/schema";

export class PDFService {
  generatePDFContent(auditResult: AuditResult): string {
    const { url, timestamp, summary, issues, actionPlan, score } = auditResult;
    
    // Parse JSON strings back to objects
    const typedSummary = typeof summary === 'string' ? JSON.parse(summary) : summary;
    const typedIssues = typeof issues === 'string' ? JSON.parse(issues) : issues;
    const typedActionPlan = typeof actionPlan === 'string' ? JSON.parse(actionPlan) : actionPlan;
    
    // Generate HTML content for PDF
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rapport d'Audit SEO - ${url}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 48px; font-weight: bold; color: ${this.getScoreColor(score)}; }
        .score-label { font-size: 18px; color: #666; }
        .section { margin: 30px 0; }
        .issue { margin: 15px 0; padding: 15px; border-left: 4px solid #ddd; }
        .critical { border-color: #ef4444; background: #fef2f2; }
        .warning { border-color: #f59e0b; background: #fffbeb; }
        .optimization { border-color: #3b82f6; background: #eff6ff; }
        .issue-title { font-weight: bold; margin-bottom: 8px; }
        .recommendation { margin-top: 10px; font-style: italic; color: #4b5563; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .summary-card { text-align: center; padding: 20px; border-radius: 8px; }
        .card-passed { background: #dcfce7; }
        .card-warnings { background: #fef3c7; }
        .card-critical { background: #fee2e2; }
        .card-optimizations { background: #dbeafe; }
        .action-plan { margin: 20px 0; }
        .priority-high { color: #dc2626; }
        .priority-medium { color: #d97706; }
        .priority-low { color: #2563eb; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport d'Audit SEO</h1>
        <h2>${url}</h2>
        <p>Généré le ${new Date(timestamp).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <div class="score">${score}/100</div>
        <div class="score-label">${this.getScoreLabel(score)}</div>
    </div>

    <div class="section">
        <h3>Résumé Exécutif</h3>
        <div class="summary-grid">
            <div class="summary-card card-passed">
                <div style="font-size: 24px; font-weight: bold;">${typedSummary.passed}</div>
                <div>Tests réussis</div>
            </div>
            <div class="summary-card card-warnings">
                <div style="font-size: 24px; font-weight: bold;">${typedSummary.warnings}</div>
                <div>Avertissements</div>
            </div>
            <div class="summary-card card-critical">
                <div style="font-size: 24px; font-weight: bold;">${typedSummary.critical}</div>
                <div>Problèmes critiques</div>
            </div>
            <div class="summary-card card-optimizations">
                <div style="font-size: 24px; font-weight: bold;">${typedSummary.optimizations}</div>
                <div>Optimisations</div>
            </div>
        </div>
    </div>
`;

    // Add critical issues
    const criticalIssues = typedIssues.filter((issue: SEOIssue) => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      html += `
    <div class="section">
        <h3>🚨 Problèmes Critiques</h3>
`;
      criticalIssues.forEach((issue: SEOIssue) => {
        html += `
        <div class="issue critical">
            <div class="issue-title">${issue.title}</div>
            <div>${issue.description}</div>
            ${issue.recommendation ? `<div class="recommendation">💡 ${issue.recommendation}</div>` : ''}
        </div>
`;
      });
      html += `    </div>`;
    }

    // Add warnings
    const warningIssues = typedIssues.filter((issue: SEOIssue) => issue.severity === 'warning');
    if (warningIssues.length > 0) {
      html += `
    <div class="section">
        <h3>⚠️ Avertissements</h3>
`;
      warningIssues.forEach((issue: SEOIssue) => {
        html += `
        <div class="issue warning">
            <div class="issue-title">${issue.title}</div>
            <div>${issue.description}</div>
            ${issue.recommendation ? `<div class="recommendation">💡 ${issue.recommendation}</div>` : ''}
        </div>
`;
      });
      html += `    </div>`;
    }

    // Add action plan
    if (typedActionPlan && typedActionPlan.length > 0) {
      html += `
    <div class="section">
        <h3>📋 Plan d'Action Détaillé</h3>
        <div class="action-plan">
`;

      const highPriority = typedActionPlan.filter((item: ActionPlanItem) => item.priority === 'high');
      const mediumPriority = typedActionPlan.filter((item: ActionPlanItem) => item.priority === 'medium');
      const lowPriority = typedActionPlan.filter((item: ActionPlanItem) => item.priority === 'low');

      if (highPriority.length > 0) {
        html += `<h4 class="priority-high">🚨 Priorité Haute</h4>`;
        highPriority.forEach((item: ActionPlanItem) => {
          html += `
        <div class="issue critical">
            <div class="issue-title">${item.title}</div>
            <div>${item.description}</div>
            <div style="margin-top: 8px; font-size: 12px;">
                <strong>Délai:</strong> ${item.timeframe} • <strong>Difficulté:</strong> ${this.getDifficultyLabel(item.difficulty)}
            </div>
        </div>
`;
        });
      }

      if (mediumPriority.length > 0) {
        html += `<h4 class="priority-medium">⚠️ Priorité Moyenne</h4>`;
        mediumPriority.forEach((item: ActionPlanItem) => {
          html += `
        <div class="issue warning">
            <div class="issue-title">${item.title}</div>
            <div>${item.description}</div>
            <div style="margin-top: 8px; font-size: 12px;">
                <strong>Délai:</strong> ${item.timeframe} • <strong>Difficulté:</strong> ${this.getDifficultyLabel(item.difficulty)}
            </div>
        </div>
`;
        });
      }

      if (lowPriority.length > 0) {
        html += `<h4 class="priority-low">💡 Améliorations Long Terme</h4>`;
        lowPriority.forEach((item: ActionPlanItem) => {
          html += `
        <div class="issue optimization">
            <div class="issue-title">${item.title}</div>
            <div>${item.description}</div>
            <div style="margin-top: 8px; font-size: 12px;">
                <strong>Délai:</strong> ${item.timeframe} • <strong>Difficulté:</strong> ${this.getDifficultyLabel(item.difficulty)}
            </div>
        </div>
`;
        });
      }

      html += `
        </div>
    </div>
`;
    }

    html += `
    <div class="section" style="margin-top: 60px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>Rapport généré par <strong>ShopifyAudit</strong></p>
        <p>Optimisez le SEO de votre boutique Shopify avec nos outils professionnels</p>
    </div>
</body>
</html>
`;

    return html;
  }

  private getScoreColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    return '#ef4444';
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

  async generatePDFBuffer(auditResult: AuditResult): Promise<Buffer> {
    const htmlContent = this.generatePDFContent(auditResult);
    
    // For now, return the HTML as a buffer
    // In production, this would use a library like Puppeteer to generate actual PDF
    return Buffer.from(htmlContent, 'utf-8');
  }
}

export const pdfService = new PDFService();