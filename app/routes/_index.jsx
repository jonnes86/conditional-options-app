// app/routes/_index.jsx
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.search ? `?${url.searchParams.toString()}` : "";
  return redirect(`/app${search}`);
};
