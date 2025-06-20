
import { storage } from "../storage";
import { exportService } from "../services/export-service";
import { pdfService } from "../services/pdf-service";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function exportMarkdownHandler(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { auditId } = body;
    const auditResult = await storage.getAuditResult(auditId);
    
    if (!auditResult) {
      return new Response(JSON.stringify({ error: "Résultat d'audit non trouvé" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const markdown = exportService.generateMarkdownReport(auditResult);
    const filename = exportService.generateFileName(auditResult.url, 'md');
    
    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error("Markdown export error:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'export Markdown" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function exportJsonHandler(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { auditId } = body;
    const auditResult = await storage.getAuditResult(auditId);
    
    if (!auditResult) {
      return new Response(JSON.stringify({ error: "Résultat d'audit non trouvé" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filename = exportService.generateFileName(auditResult.url, 'json');
    
    return new Response(JSON.stringify(auditResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error("JSON export error:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'export JSON" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function exportPdfHandler(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { auditId, sessionId } = body;
    
    if (!stripe || !sessionId) {
      return new Response(JSON.stringify({ error: "Session de paiement requise" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid' || session.metadata?.auditId !== auditId.toString()) {
      return new Response(JSON.stringify({ error: "Paiement non vérifié" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const auditResult = await storage.getAuditResult(auditId);
    if (!auditResult) {
      return new Response(JSON.stringify({ error: "Résultat d'audit non trouvé" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const pdfContent = pdfService.generatePDFContent(auditResult);
    const filename = exportService.generateFileName(auditResult.url, 'html');
    
    return new Response(pdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error("PDF export error:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'export PDF" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
