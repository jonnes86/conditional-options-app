// app/routes/auth.callback.jsx
import shopify from "../shopify.server";
export const loader = async ({ request }) => {
  await shopify.authenticate.callback(request);
  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
};
export default function AuthCallback() { return null; }
