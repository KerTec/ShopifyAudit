
import { storage } from "../storage";

export async function getRecentAuditsHandler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const audits = await storage.getRecentAudits(limit);
    
    return new Response(JSON.stringify(audits), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error("Recent audits error:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des audits" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function pingHandler(_request: Request): Promise<Response> {
  return new Response("pong", {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function statusHandler(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({
    status: "online",
    service: "ShopifyAudit",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function healthHandler(_request: Request): Promise<Response> {
  return new Response(JSON.stringify({ 
    status: 'online', 
    timestamp: new Date().toISOString(),
    message: 'ShopifyAudit est en ligne !',
    uptime: process.uptime()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export function corsHandler(_request: Request): Response {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, stripe-signature'
    }
  });
}
