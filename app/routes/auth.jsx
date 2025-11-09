// app/routes/auth.jsx
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  // Bounce to the library-provided /auth/login route with the same params
  if (shop) {
    const to = new URL("/auth/login", url.origin);
    to.searchParams.set("shop", shop);
    if (host) to.searchParams.set("host", host);
    return redirect(to.toString());
  }

  // If no shop param, let /app trigger the standard flow
  return redirect("/app");
};
