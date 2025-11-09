import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  // You’re authenticated; return basic info if you like:
  return json({ shop: session.shop });
};

export default function AppIndex() {
  const data = useLoaderData();
  return (
    <div style={{ padding: 24 }}>
      <h1>Conditional Options App</h1>
      <p>Shop: {data.shop}</p>
      <p>Welcome! This is your embedded app shell.</p>
    </div>
  );
}
