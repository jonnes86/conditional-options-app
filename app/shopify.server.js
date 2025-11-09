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

/**
 * Old routes expect { authenticate } from "../shopify.server"
 * Newer SDK exposes shopify.authenticate.{admin, public}
 * Export it as-is so imports keep working.
 */
export const authenticate = shopify.authenticate;

/**
 * Some templates import { login } and call login(request)
 * Provide a simple shim that begins OAuth. Make sure you have an /auth/callback route that calls shopify.auth.callback.
 */
export async function login(request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || undefined;
  return shopify.auth.begin({ shop, callbackPath: "/auth/callback" });
}
