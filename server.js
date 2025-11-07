import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import express from "express";
import { readFileSync } from "fs";

installGlobals();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();

app.use(
  viteDevServer ? viteDevServer.middlewares : express.static("build/client")
);

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
  
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
});
