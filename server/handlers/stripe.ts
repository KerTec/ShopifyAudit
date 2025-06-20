
import Stripe from "stripe";
import { storage } from "../storage";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function createCheckoutSessionHandler(request: Request): Promise<Response> {
  if (!stripe) {
    return new Response(JSON.stringify({ error: "Stripe non configuré" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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

    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;

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
      success_url: `${origin}/?payment=success&audit=${auditId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
      metadata: {
        auditId: auditId.toString(),
        url: auditResult.url,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return new Response(JSON.stringify({ 
      error: "Erreur lors de la création de la session: " + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function createPaymentIntentHandler(request: Request): Promise<Response> {
  if (!stripe) {
    return new Response(JSON.stringify({ error: "Stripe non configuré" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999, // 9.99 EUR in cents
      currency: "eur",
      metadata: {
        auditId: auditId.toString(),
        url: auditResult.url,
      },
      description: `Export PDF Premium - Audit SEO pour ${auditResult.url}`,
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error("Payment intent error:", error);
    return new Response(JSON.stringify({ 
      error: "Erreur lors de la création du paiement: " + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function webhookHandler(request: Request): Promise<Response> {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Stripe webhook non configuré" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment successful for audit:', session.metadata?.auditId);
      
      if (session.metadata?.auditId) {
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

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
