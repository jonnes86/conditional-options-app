import { createRequestHandler } from "@remix-run/express";
import express from "express";

let helmet;
try {
  const mod = await import("helmet");
  helmet = mod.default || mod;
} catch {
  console.warn("helmet not installed, continuing without it");
}

const app = express();
const PORT = process.env.PORT || 8080;

// trust proxy when running behind Railway
app.set("trust proxy", 1);

// Health check endpoint (Railway)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Basic parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Security (won’t crash if helmet missing)
if (helmet) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
}

// Static assets
app.use(express.static("public", { maxAge: "1h", immutable: true }));

// Load Remix build
let build;
try {
  build = await import("./build/server/index.js");
  console.log("✅ Remix server build loaded");
} catch (error) {
  console.error("❌ Failed to load Remix build:", error);
  app.get("*", (_req, res) => {
    res
      .status(200)
      .send(
        `<html><head><title>Conditional Options</title></head><body><h1>Conditional Options App</h1><p>Server is running but Remix build is not available.</p></body></html>`
      );
  });
}

// Use Remix for all routes
if (build) {
  app.all(
    "*",
    createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    })
  );
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Listening on http://0.0.0.0:${PORT}`);
  console.log(`🏥 Healthcheck at        /health`);
});
