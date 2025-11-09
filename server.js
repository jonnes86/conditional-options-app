// server.js (ESM)
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const build = require("./build/server/index.cjs");

const app = express();

app.use(compression());
app.use(morgan("tiny"));
app.use("/build", express.static("public/build", { immutable: true, maxAge: "1y" }));
app.use(express.static("public", { maxAge: "1h" }));

app.all(
  "*",
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ Listening on http://0.0.0.0:${port}`);
});
