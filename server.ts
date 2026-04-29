import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import proxy from "express-http-proxy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || "https://incident-report-backend-2.onrender.com";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Proxy /api and /auth requests FIRST
  const apiProxy = proxy(BACKEND_URL, {
    proxyReqPathResolver: (req) => {
      // Use originalUrl to preserve query parameters
      const resolvedPath = req.originalUrl;
      console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${BACKEND_URL}${resolvedPath}`);
      return resolvedPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Ensure headers object exists
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      
      // Forward all headers except host (which should be set by backend URL)
      // express-http-proxy usually handles this, but let's be safe
      const authHeader = srcReq.headers['authorization'];
      if (authHeader) {
        proxyReqOpts.headers['authorization'] = authHeader;
      }
      
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      const statusCode = proxyRes.statusCode || 200;
      if (statusCode >= 400) {
        console.log(`[Proxy] Backend returned ${statusCode} for ${userReq.url}`);
      }
      return proxyResData;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error(`[Proxy Error] for ${res.req.url}: ${err.message}`);
      res.status(502).json({ 
        success: false, 
        message: "Bad Gateway: Proxy failed to reach backend.", 
        error: err.message 
      });
    }
  });

  app.use("/api", apiProxy);
  app.use("/auth", apiProxy);

  // 2. Standard Middleware
  app.use(express.json());

  // Logging middleware for non-proxied routes
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api')) {
      console.log(`[Server] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check (not proxied)
  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(), 
      backend: BACKEND_URL,
      version: "1.0.1"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Proxying /api requests to ${BACKEND_URL}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
