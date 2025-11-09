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
app.use(compression());
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.status(200).send("OK"));

app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);
app.use(express.static("public", { maxAge: "1h" }));

app.all(
  "*",
  createRequestHandler({
    build: BUILD,
    mode: MODE,
    getLoadContext() {
      return { addDocumentResponseHeaders };
    },
  })
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Listening on http://0.0.0.0:${port}`);
  console.log("🏥 Healthcheck at        /health");
});
