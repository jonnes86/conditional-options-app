// app/routes/auth.$.jsx
import shopify from "../shopify.server";
export const loader = async ({ request }) => {
  return shopify.authenticate.admin(request);
};
export default function AuthBegin() { return null; }
