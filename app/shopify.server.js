// app/shopify.server.js
import { shopifyApp, LATEST_API_VERSION } from "@shopify/shopify-app-remix/server";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

const prisma = new PrismaClient();
const sessionStorage = new PrismaSessionStorage(prisma);

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: (process.env.SHOPIFY_SCOPES || process.env.SCOPES || "").split(",").map(s => s.trim()).filter(Boolean),
  appUrl: process.env.SHOPIFY_APP_URL || process.env.APP_URL,
  sessionStorage,
  apiVersion: LATEST_API_VERSION,
});

export const authenticate = shopify.authenticate;

export async function login(request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || undefined;
  return shopify.auth.begin({ shop, callbackPath: "/auth/callback" });
}

// 👇 add this line so routes can `import shopify from "../shopify.server"`
export default shopify;
