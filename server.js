import { createRequestHandler } from "@remix-run/node";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static("public"));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Load the Remix build
const build = await import("./build/server/index.js");

// Handle all other requests with Remix
app.all("*", createRequestHandler({ build }));

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server started on http://0.0.0.0:${port}`);
});