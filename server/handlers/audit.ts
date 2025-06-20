
import { SEOAuditEngine } from "../services/audit-engine";
import { storage } from "../storage";
import { auditRequestSchema } from "@shared/schema";

export async function auditHandler(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { url } = auditRequestSchema.parse(body);
    
    const auditEngine = new SEOAuditEngine();
    const result = await auditEngine.auditUrl(url);
    const savedResult = await storage.saveAuditResult(result);
    
    return new Response(JSON.stringify(savedResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error: any) {
    console.error("Audit error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Erreur lors de l'audit SEO" 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
