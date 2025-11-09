// app/routes/auth.jsx
import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";

/**
 * Handles Shopify's first hit to /auth?shop=...&host=...
 * We just delegate to Shopify's login() helper, which will start OAuth.
 */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (!shop) {
    // If someone hits /auth directly without a shop param, punt to /app
    return redirect("/app");
  }
  // This throws a redirect Response to Shopify's OAuth screen
  throw await login(request);
};
