import { login } from "../shopify.server";

export const loader = async ({ request }) => {
  // Starts Shopify OAuth; returns a redirect Response
  return login(request);
};
