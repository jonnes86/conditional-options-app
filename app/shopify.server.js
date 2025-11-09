// app/shopify.server.js
import { shopifyApp, LATEST_API_VERSION } from "@shopify/shopify-app-remix/server";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

const prisma = new PrismaClient();

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: (process.env.SCOPES || "").split(",").map(s => s.trim()).filter(Boolean),
    apiVersion: LATEST_API_VERSION,
  },
  appUrl: process.env.SHOPIFY_APP_URL,         // e.g. https://your-domain.app
  sessionStorage: new PrismaSessionStorage(prisma),
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
  },
});

export default shopify;
