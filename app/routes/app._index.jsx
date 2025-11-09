// app/routes/app._index.jsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // This ensures a valid session or redirects to /auth/login with the right params
  await authenticate.admin(request);
  return json({ ok: true });
};

export default function AppHome() {
  const _ = useLoaderData();
  return (
    <div style={{ padding: 16 }}>
      <h1>Conditional Options App</h1>
      <p>You're authenticated ✅</p>
    </div>
  );
}
