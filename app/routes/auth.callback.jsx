// completes OAuth and stores the session
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  // remix shopify lib will handle redirect back to embedded app
  return null;
};
