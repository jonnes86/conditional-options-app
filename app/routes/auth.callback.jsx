import { authenticate } from "../shopify.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  // After successful OAuth, land in your app:
  return redirect("/app");
};
