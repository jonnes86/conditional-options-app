import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { readFileSync } from "fs";

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files
app.use(express.static("build/client"));

// Load build
const build = await import("./build/server/index.js");

// Handle all requests
app.all("*", createRequestHandler({ build }));

app.listen(port, '0.0.0.0', () => {
  console.log(`Express server listening at http://0.0.0.0:${port}`);
});