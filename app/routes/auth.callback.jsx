// app/routes/auth.callback.jsx
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Validates callback, sets session cookie, registers webhooks if configured
  await authenticate.admin(request);
  // Let Remix continue to the post-auth redirect (the library manages it)
  return null;
};
