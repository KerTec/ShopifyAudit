import { AuditResult } from "@shared/schema";

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
      return false;
    }
  }
}

export function generateClipboardSummary(auditResult: AuditResult): string {
  const { url, timestamp, summary, score } = auditResult;
  
  let text = `Audit SEO - ${url}\n`;
  text += `Date: ${new Date(timestamp).toLocaleDateString('fr-FR')}\n\n`;
  text += `Score: ${score}/100\n\n`;
  text += `Résumé:\n`;
  text += `- Tests réussis: ${summary.passed}\n`;
  text += `- Avertissements: ${summary.warnings}\n`;
  text += `- Problèmes critiques: ${summary.critical}\n`;
  text += `- Optimisations: ${summary.optimizations}\n\n`;
  text += `Généré par ShopifyAudit\n`;
  
  return text;
}

export function downloadAsJSON(auditResult: AuditResult) {
  const dataStr = JSON.stringify(auditResult, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const cleanUrl = auditResult.url.replace(/[^a-zA-Z0-9]/g, '-');
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `audit-seo-${cleanUrl}-${timestamp}.json`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
