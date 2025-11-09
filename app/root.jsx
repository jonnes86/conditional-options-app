// app/root.jsx
import { json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";

export const loader = async ({ request, context }) => {
  const headers = new Headers();
  if (typeof context?.addDocumentResponseHeaders === "function") {
    context.addDocumentResponseHeaders(headers, { request });
  }
  return json({ ok: true }, { headers });
};

export const headers = (args) => boundary.headers(args);
export function ErrorBoundary() { return boundary.error(useRouteError()); }

export default function Root() {
  return (
    <html lang="en">
      <head><Meta /><Links /></head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
