// starts top-level OAuth flow
import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  if (!shop) return redirect("/app"); // or show an error page if you prefer

  // This throws a Response that redirects to Shopify
  throw await login(request);
};
