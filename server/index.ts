
import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { handleRequest } from "./handlers/router";
import { createServer, type Server } from "http";

const app = express();

// Middleware pour parser le body des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de logging simplifié
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api") || path === "/ping" || path === "/health") {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Router serverless pour toutes les routes API
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const url = req.url;
  
  // Skip non-API routes pour laisser Vite/static gérer
  if (!url.startsWith('/api') && url !== '/ping' && url !== '/health' && url !== '/webhook') {
    return next();
  }

  try {
    // Créer une Request compatible avec les handlers serverless
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const serverlessRequest = new Request(fullUrl, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    const serverlessResponse = await handleRequest(serverlessRequest);
    
    // Convertir la Response serverless en réponse Express
    const responseBody = await serverlessResponse.text();
    
    // Copier les headers
    serverlessResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    res.status(serverlessResponse.status).send(responseBody);
  } catch (error: any) {
    console.error('Serverless handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware d'erreur global
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

async function startServer() {
  const server = createServer(app);

  // Auto ping pour maintenir l'app éveillée
  setInterval(async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      console.log(`[Keep-alive] App ping successful: ${response.status}`);
    } catch (error: any) {
      console.log('[Keep-alive] Ping failed:', error.message);
    }
  }, 25 * 60 * 1000); // Ping toutes les 25 minutes

  // Configuration Vite/Static selon l'environnement
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Démarrer le serveur sur le port 5000
  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 ShopifyAudit serving on port ${port}`);
    log(`📱 App accessible publiquement via votre URL Replit`);
    log(`💰 Prêt à générer des revenus !`);
    log(`🔧 Architecture serverless active`);
  });
}

startServer().catch(console.error);
