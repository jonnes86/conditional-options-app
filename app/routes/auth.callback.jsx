import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Finishes OAuth and stores the session
  await authenticate.admin(request);
  return new Response(null, { status: 302, headers: { Location: "/app" } });
};
