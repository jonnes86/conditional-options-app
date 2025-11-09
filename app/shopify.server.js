// app/shopify.server.js
import '@shopify/shopify-app-remix/server/adapters/node';
import { shopifyApp, LATEST_API_VERSION } from '@shopify/shopify-app-remix/server';

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  appUrl: process.env.SHOPIFY_APP_URL,               // e.g. https://llama-conditional-options.up.railway.app
  scopes: (process.env.SCOPES || 'read_products').split(','),
  apiVersion: LATEST_API_VERSION,
  authPathPrefix: '/auth',                            // default, but explicit is fine
});

export default shopify;

// Helper so server.js/root can set CSP/etc on HTML responses
export function addDocumentResponseHeaders(headers, { request }) {
  shopify.addDocumentResponseHeaders(request, headers);
}
