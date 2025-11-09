// app/routes/auth.login.jsx
import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";

// Extract shop from query, headers, or host param
function getShopFromRequest(request) {
  const url = new URL(request.url);

  // 1) query ?shop=
  let shop = url.searchParams.get("shop");

  // 2) Shopify header (present in embedded Admin)
  if (!shop) {
    const hdr = request.headers.get("x-shopify-shop-domain");
    if (hdr) shop = hdr;
  }

  // 3) decode ?host= (base64). It may contain "<shop>.myshopify.com/admin" or an admin path.
  if (!shop) {
    const host = url.searchParams.get("host");
    if (host) {
      try {
        const decoded = Buffer.from(host, "base64").toString("utf-8");
        // Try to pull "<shop>.myshopify.com" out of the decoded string
        const m = decoded.match(/([\w-]+\.myshopify\.com)/i);
        if (m && m[1]) shop = m[1].toLowerCase();
      } catch {
        // ignore
      }
    }
  }

  return shop || null;
}

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = getShopFromRequest(request);

  if (!shop) {
    // If we *still* don't have a shop, send the user back to /app WITH the original query
    // so the /app loader can maintain context (and not hard-loop).
    const search = url.search ? `?${url.searchParams.toString()}` : "";
    return redirect(`/app${search}`);
  }

  // Ensure the /auth/login URL we're handing to Shopify includes the shop param
  if (!url.searchParams.get("shop")) {
    url.searchParams.set("shop", shop);
    return redirect(url.toString());
  }

  // Kick off OAuth (shopify library will 302 as needed)
  throw await login(request);
};
