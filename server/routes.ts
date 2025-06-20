import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { SEOAuditEngine } from "./services/audit-engine";
import { exportService } from "./services/export-service";
import { pdfService } from "./services/pdf-service";
import { auditRequestSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not found. Premium exports will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  const auditEngine = new SEOAuditEngine();

  // SEO Audit endpoint
  app.post("/api/audit", async (req, res) => {
    try {
      const { url } = auditRequestSchema.parse(req.body);
      
      const result = await auditEngine.auditUrl(url);
      const savedResult = await storage.saveAuditResult(result);
      
      res.json(savedResult);
    } catch (error: any) {
      console.error("Audit error:", error);
      res.status(400).json({ 
        error: error.message || "Erreur lors de l'audit SEO" 
      });
    }
  });

  // Export Markdown endpoint
  app.post("/api/export/markdown", async (req, res) => {
    try {
      const { auditId } = req.body;
      const auditResult = await storage.getAuditResult(auditId);
      
      if (!auditResult) {
        return res.status(404).json({ error: "Résultat d'audit non trouvé" });
      }

      const markdown = exportService.generateMarkdownReport(auditResult);
      const filename = exportService.generateFileName(auditResult.url, 'md');
      
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(markdown);
    } catch (error: any) {
      console.error("Markdown export error:", error);
      res.status(500).json({ error: "Erreur lors de l'export Markdown" });
    }
  });

  // Export JSON endpoint
  app.post("/api/export/json", async (req, res) => {
    try {
      const { auditId } = req.body;
      const auditResult = await storage.getAuditResult(auditId);
      
      if (!auditResult) {
        return res.status(404).json({ error: "Résultat d'audit non trouvé" });
      }

      const filename = exportService.generateFileName(auditResult.url, 'json');
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json(auditResult);
    } catch (error: any) {
      console.error("JSON export error:", error);
      res.status(500).json({ error: "Erreur lors de l'export JSON" });
    }
  });

  // Stripe checkout session for premium PDF export
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe non configuré" });
    }

    try {
      const { auditId } = req.body;
      const auditResult = await storage.getAuditResult(auditId);
      
      if (!auditResult) {
        return res.status(404).json({ error: "Résultat d'audit non trouvé" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Export PDF Premium - Audit SEO',
              description: `Rapport d'audit SEO professionnel pour ${auditResult.url}`,
            },
            unit_amount: 999, // 9.99 EUR en centimes
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/?payment=success&audit=${auditId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?payment=cancelled`,
        metadata: {
          auditId: auditId.toString(),
          url: auditResult.url,
        },
      });

      res.json({ sessionId: session.id });
    } catch (error: any) {
      console.error("Checkout session error:", error);
      res.status(500).json({ 
        error: "Erreur lors de la création de la session: " + error.message 
      });
    }
  });

  // Keep the payment intent endpoint for backward compatibility
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe non configuré" });
    }

    try {
      const { auditId } = req.body;
      const auditResult = await storage.getAuditResult(auditId);
      
      if (!auditResult) {
        return res.status(404).json({ error: "Résultat d'audit non trouvé" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 999, // 9.99 EUR in cents
        currency: "eur",
        metadata: {
          auditId: auditId.toString(),
          url: auditResult.url,
        },
        description: `Export PDF Premium - Audit SEO pour ${auditResult.url}`,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ 
        error: "Erreur lors de la création du paiement: " + error.message 
      });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhook", async (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).json({ error: "Stripe webhook non configuré" });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for audit:', session.metadata?.auditId);
        
        // Store payment success for later PDF generation
        if (session.metadata?.auditId) {
          // In a real implementation, you would:
          // 1. Mark the audit as paid
          // 2. Generate PDF and send via email
          // 3. Or provide a secure download link
          console.log(`PDF access granted for audit ${session.metadata.auditId}`);
        }
        
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent successful for audit:', paymentIntent.metadata.auditId);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // PDF download endpoint for premium users
  app.post("/api/export/pdf", async (req, res) => {
    try {
      const { auditId, sessionId } = req.body;
      
      if (!stripe || !sessionId) {
        return res.status(400).json({ error: "Session de paiement requise" });
      }

      // Verify payment session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid' || session.metadata?.auditId !== auditId.toString()) {
        return res.status(403).json({ error: "Paiement non vérifié" });
      }

      const auditResult = await storage.getAuditResult(auditId);
      if (!auditResult) {
        return res.status(404).json({ error: "Résultat d'audit non trouvé" });
      }

      const pdfContent = pdfService.generatePDFContent(auditResult);
      const filename = exportService.generateFileName(auditResult.url, 'html');
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(pdfContent);
    } catch (error: any) {
      console.error("PDF export error:", error);
      res.status(500).json({ error: "Erreur lors de l'export PDF" });
    }
  });

  // Get recent audits
  app.get("/api/audits/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const audits = await storage.getRecentAudits(limit);
      res.json(audits);
    } catch (error: any) {
      console.error("Recent audits error:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des audits" });
    }
  });

  // Endpoint de monitoring pour services externes (UptimeRobot, etc.)
  app.get("/ping", (_req, res) => {
    res.status(200).send("pong");
  });

  // Endpoint racine pour vérification rapide
  app.get("/api/status", (_req, res) => {
    res.status(200).json({
      status: "online",
      service: "ShopifyAudit",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
