import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  // Preserve ?shop param so the auth flow knows where to go
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  return redirect(shop ? `/app?shop=${encodeURIComponent(shop)}` : "/app");
};
