// app/root.jsx
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

/**
 * Loader runs for the root document.
 * We call Shopify's addDocumentResponseHeaders helper to inject
 * frame-ancestor, CSP, and session cookies for embedded apps.
 */
export const loader = async ({ request, context }) => {
  const headers = new Headers();

  // Add Shopify-required headers (frame-ancestors, etc.)
  if (typeof context?.addDocumentResponseHeaders === "function") {
    context.addDocumentResponseHeaders(headers, { request });
  }

  return json({ ok: true }, { headers });
};

/**
 * Merge document-level headers with Shopify's injected headers.
 * The context.addDocumentResponseHeaders call writes to loaderHeaders,
 * so we must expose them here.
 */
export function headers({ loaderHeaders, context }) {
  if (typeof context?.addDocumentResponseHeaders === "function") {
    context.addDocumentResponseHeaders(loaderHeaders);
  }
  return loaderHeaders;
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
