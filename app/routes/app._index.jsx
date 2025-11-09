import { json, redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // If we don't have a session yet, this throws a redirect to /auth/login
  const { admin } = await authenticate.admin(request);
  // If we got here, we are authenticated and embedded.
  return json({ shop: admin.shop });
};

export default function AppHome() {
  return <div style={{ padding: 16 }}>App loaded ✅</div>;
}
