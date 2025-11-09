import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";

const prisma = new PrismaClient();

export const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: (process.env.SCOPES ?? "").split(","),
    hostName: process.env.SHOPIFY_APP_URL?.replace(/^https?:\/\//, ""),
    hostScheme: process.env.SHOPIFY_APP_URL?.startsWith("https") ? "https" : "http",
  },
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
  },
  sessionStorage: new PrismaSessionStorage(prisma, {
    tableName: "Session", // must match the Prisma model/table above
  }),
});
