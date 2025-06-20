
import { auditHandler } from "./audit";
import { exportMarkdownHandler, exportJsonHandler, exportPdfHandler } from "./export";
import { createCheckoutSessionHandler, createPaymentIntentHandler, webhookHandler } from "./stripe";
import { getRecentAuditsHandler, pingHandler, statusHandler, healthHandler, corsHandler } from "./utils";

export interface RouteHandler {
  method: string;
  path: string;
  handler: (request: Request) => Promise<Response>;
}

export const routes: RouteHandler[] = [
  // Audit routes
  { method: 'POST', path: '/api/audit', handler: auditHandler },
  
  // Export routes
  { method: 'POST', path: '/api/export/markdown', handler: exportMarkdownHandler },
  { method: 'POST', path: '/api/export/json', handler: exportJsonHandler },
  { method: 'POST', path: '/api/export/pdf', handler: exportPdfHandler },
  
  // Stripe routes
  { method: 'POST', path: '/api/create-checkout-session', handler: createCheckoutSessionHandler },
  { method: 'POST', path: '/api/create-payment-intent', handler: createPaymentIntentHandler },
  { method: 'POST', path: '/api/webhook', handler: webhookHandler },
  
  // Utility routes
  { method: 'GET', path: '/api/audits/recent', handler: getRecentAuditsHandler },
  { method: 'GET', path: '/ping', handler: pingHandler },
  { method: 'GET', path: '/api/status', handler: statusHandler },
  { method: 'GET', path: '/health', handler: healthHandler },
  
  // CORS preflight
  { method: 'OPTIONS', path: '*', handler: corsHandler }
];

export function matchRoute(method: string, pathname: string): RouteHandler | null {
  return routes.find(route => {
    if (route.method !== method) return false;
    if (route.path === '*') return true;
    return route.path === pathname;
  }) || null;
}

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const pathname = url.pathname;

  // Handle CORS preflight for all requests
  if (method === 'OPTIONS') {
    return corsHandler(request);
  }

  const route = matchRoute(method, pathname);
  if (!route) {
    return new Response(JSON.stringify({ error: 'Route not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    return await route.handler(request);
  } catch (error: any) {
    console.error(`Error handling ${method} ${pathname}:`, error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
