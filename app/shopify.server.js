// app/shopify.server.js
import '@shopify/shopify-app-remix/server/adapters/node';
import { shopifyApp, LATEST_API_VERSION } from '@shopify/shopify-app-remix/server';

// ---- Core app config ----
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  appUrl: process.env.SHOPIFY_APP_URL,          // e.g. https://llama-conditional-options.up.railway.app
  scopes: (process.env.SCOPES || 'read_products').split(','),
  apiVersion: LATEST_API_VERSION,

  // keep the default prefix; your routes reference /auth already
  authPathPrefix: '/auth',
});

// ---- Exports expected by your existing code ----

// 1) Your routes import { authenticate } from "../shopify.server"
//    Make it identical to the library shape so loader code like
//    "await authenticate.admin(request)" keeps working.
export const authenticate = shopify.authenticate;

// 2) Your routes import { login } from "../shopify.server"
//    Many legacy templates call `login(request)` to kick off OAuth.
//    This simply defers to the Admin auth flow (will redirect as needed).
export async function login(request) {
  return shopify.authenticate.admin(request);
}

// 3) Remix <-> Shopify CSP/headers hook used in server.js -> getLoadContext()
export function addDocumentResponseHeaders(headers, { request }) {
  shopify.addDocumentResponseHeaders(request, headers);
}

// 4) Also export default for direct imports if you use them elsewhere
export default shopify;
