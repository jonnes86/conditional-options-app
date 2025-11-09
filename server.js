// server.js (Express)
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import * as build from "./build/server/index.cjs";

const app = express();
app.use(compression());
app.use(morgan("tiny"));

// ✅ Healthcheck that does NOT hit Remix router
app.get("/health", (_req, res) => {
  res.type("text").send("ok");
});

// static assets etc...
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }));
app.use(express.static("public", { maxAge: "1h" }));

app.all("*", createRequestHandler({ build }));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Listening on http://0.0.0.0:${port}`);
  console.log("🏥 Healthcheck at        /health");
});
