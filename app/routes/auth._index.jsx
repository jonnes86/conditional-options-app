import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  return redirect(`/auth/login${qs ? `?${qs}` : ""}`);
};