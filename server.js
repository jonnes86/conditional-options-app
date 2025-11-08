// server.js
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 8080; // Railway uses 8080 by default

// --- CSP for Shopify embedded apps ---
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Allow Shopify Admin / storefront to frame your app
        "frame-ancestors": [
          "'self'",
          "https://admin.shopify.com",
          "https://*.myshopify.com",
        ],
        // Allow scripts/styles/assets from Shopify CDN + self
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.shopify.com",
          "https://shopify.dev",
          "https://*.shopifycloud.com",
          "https://admin.shopify.com",
          "https://*.myshopify.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.shopify.com",
          "https://*.shopifycloud.com",
        ],
        "connect-src": [
          "'self'",
          "https://cdn.shopify.com",
          "https://*.shopifycloud.com",
          "https://admin.shopify.com",
          "https://*.myshopify.com",
        ],
        "img-src": ["'self'", "data:", "https://cdn.shopify.com", "https://*.myshopify.com"],
        "frame-src": ["'self'", "https://admin.shopify.com", "https://*.myshopify.com"],
      },
    },
  })
);

// Health check (Railway)
app.get("/health", (_req, res) => res.status(200).json({ status: "ok", ts: new Date().toISOString() }));

// Serve /public (favicon, robots, etc.)
app.use(express.static("public"));

// Load Remix build (SSR)
let build;
try {
  build = await import("./build/server/index.js");
  console.log("✅ Remix server build loaded");
} catch (err) {
  console.error("❌ Failed to load Remix build:", err);
}

// If Remix loaded, hand off all routes to it
if (build) {
  app.all(
    "*",
    createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    })
  );
} else {
  // Fallback (very basic)
  app.get("*", (_req, res) => {
    res
      .status(200)
      .send("<h1>Conditional Options</h1><p>Server is running, but Remix build was not found.</p>");
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Listening on http://0.0.0.0:${PORT}`);
  console.log(`🏥 Healthcheck at /health`);
});
