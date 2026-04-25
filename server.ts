import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import proxy from "express-http-proxy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_URL = process.env.BACKEND_URL || "https://incident-report-api-krni.onrender.com";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Proxy /api requests FIRST (before body parsers)
  // This ensures the raw request stream is forwarded correctly to the backend
  app.use("/api", proxy(BACKEND_URL, {
    proxyReqPathResolver: (req) => {
      // req.url is the part of the URL after "/api"
      // e.g. for "/api/auth/login", req.url is "/auth/login"
      const isAuthPath = req.url.startsWith('/auth');
      
      const resolvedPath = isAuthPath ? req.url : "/api" + req.url;
      
      console.log(`[Proxy] Routing ${req.method} /api${req.url} -> ${BACKEND_URL}${resolvedPath}`);
      return resolvedPath;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      const authHeader = srcReq.headers['authorization'];
      if (authHeader) {
        proxyReqOpts.headers['authorization'] = authHeader;
        console.log(`[Proxy] Forwarding Auth Header for ${srcReq.url}`);
      }
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      const statusCode = proxyRes.statusCode || 200;
      if (statusCode >= 400) {
        console.log(`[Proxy] Backend error ${statusCode} for ${userReq.url}`);
      }

      if (userReq.url.includes('/admin/create-admin')) {
        try {
          const body = JSON.parse(userReq.body || '{}');
          console.log(`[Proxy] Create Admin Payload:`, body);
        } catch (e) {
          // Body might not be available here if not parsed yet
        }
      }

      if (userReq.url.includes('/auth/login')) {
        try {
          const responseString = proxyResData.toString('utf8');
          // Only attempt parse if it looks like JSON
          if (responseString.trim().startsWith('{')) {
            const data = JSON.parse(responseString);
            const token = data.accessToken || data.token || (data.data && (data.data.accessToken || data.data.token));
            console.log(`[Proxy] Login detected. Token found: ${!!token}`);
          } else {
            console.warn(`[Proxy] Login response is not JSON: ${responseString.substring(0, 50)}...`);
          }
        } catch (e) {
          console.error(`[Proxy] Login response parse failed:`, e);
        }
      }
      return proxyResData;
    },
    userResError: (err, res, next) => {
      console.error(`[Proxy Error] ${err.message}`);
      next(err);
    }
  }));

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
