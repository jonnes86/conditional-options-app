import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { fileURLToPath } from "url";
import path from "path";
import { addDocumentResponseHeaders } from "./app/shopify.server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODE = process.env.NODE_ENV || "production";
const BUILD = await import("./build/server/index.cjs");

const app = express();

// Trust Railway / proxy so req.secure is true and cookies can be Secure
app.set("trust proxy", 1);

app.use(compression());
app.use(morgan("tiny"));

// Minimal healthcheck
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Allow Admin to frame the embedded app
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "frame-ancestors https://admin.shopify.com https://*.myshopify.com;",
      "frame-src https://admin.shopify.com https://*.myshopify.com;",
    ].join(" ")
  );
  next();
});

app.use(
  "/build",
  express.static(path.join(__dirname, "public/build"), {
    immutable: true,
    maxAge: "1y",
  })
);

app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

app.all(
  "*",
  createRequestHandler({
    build: BUILD,
    mode: MODE,
    getLoadContext() {
      // remix-shopify reads this to add per-request headers too
      return { addDocumentResponseHeaders };
    },
  })
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Listening on http://0.0.0.0:${port}`);
  console.log("🏥 Healthcheck at        /health");
});
