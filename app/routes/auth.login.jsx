import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // If Shopify calls /auth/login without ?shop, send them to /app (which will enforce auth)
  if (!shop) {
    return redirect("/app");
  }

  // Start OAuth
  throw await login(request);
};
