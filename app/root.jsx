// app/root.jsx
import { json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export const loader = async ({ request, context }) => {
  const headers = new Headers();

  // Inject Shopify's required document headers (CSP, frame-ancestors, cookies)
  if (typeof context?.addDocumentResponseHeaders === "function") {
    context.addDocumentResponseHeaders(headers, { request });
  }

  return json({ ok: true }, { headers });
};

// IMPORTANT: just return the loader's headers verbatim.
export const headers = ({ loaderHeaders }) => loaderHeaders;

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
