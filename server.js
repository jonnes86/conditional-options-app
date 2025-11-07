import { createRequestHandler } from "@remix-run/express";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint (important for Railway)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from public folder
app.use(express.static("public"));

// Load the Remix build
let build;
try {
  build = await import("./build/server/index.js");
  console.log("✅ Remix build loaded successfully");
} catch (error) {
  console.error("❌ Failed to load Remix build:", error);
  console.log("⚠️  Running in basic mode without Remix");
  
  // Fallback route if Remix build fails
  app.get('*', (req, res) => {
    res.send(`
      <html>
        <head><title>Conditional Options</title></head>
        <body>
          <h1>Conditional Options App</h1>
          <p>Server is running but Remix build is not available.</p>
          <p>Check Railway logs for build errors.</p>
        </body>
      </html>
    `);
  });
}

// If Remix loaded successfully, use it for all routes
if (build) {
  app.all("*", createRequestHandler({ build }));
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Express server listening on http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health check available at http://0.0.0.0:${PORT}/health`);
  console.log(`📦 Remix build: ${build ? 'Loaded' : 'Not available'}`);
});