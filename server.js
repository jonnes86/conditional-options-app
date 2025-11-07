import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Basic test endpoint
app.get('/', (req, res) => {
  res.send('Conditional Options App is running!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Express server listening on http://0.0.0.0:${PORT}`);
  console.log(`🏥 Health check available at http://0.0.0.0:${PORT}/health`);
});