// server.js
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequestHandler } from "@remix-run/express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Healthcheck for Railway ---
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// --- Static assets ---
// Serve the Remix client build (fingerprinted files)
app.use(
  "/build",
  express.static(path.join(__dirname, "build"), {
    immutable: true,
    maxAge: "1y",
  })
);

// Serve anything in /public (favicon, images, etc.)
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

// --- Load Remix build (server) ---
let remixBuild;
try {
  remixBuild = await import("./build/server/index.js");
  console.log("✅ Remix server build loaded");
} catch (err) {
  console.error("❌ Failed to load Remix server build:", err);
}

// --- Routes ---
// If Remix build is available, let Remix handle all remaining routes.
if (remixBuild) {
  app.all(
    "*",
    createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
    })
  );
} else {
  // Fallback (useful during early deploys if build failed)
  app.get("*", (_req, res) => {
    res
      .status(200)
      .send(
        `<!doctype html>
<html>
  <head><meta charset="utf-8"/><title>Conditional Options</title></head>
  <body>
    <h1>Conditional Options App</h1>
    <p>Server is running but Remix build is not available.</p>
    <p>Check deployment logs for build errors.</p>
  </body>
</html>`
      );
  });
}

// --- Start server ---
// Bind to 0.0.0.0 so Railway can reach the container.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Listening on http://0.0.0.0:${PORT}`);
  console.log(`🏥 Healthcheck at        /health`);
});
