// app/root.jsx
import { json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export const loader = async ({ request, context }) => {
  // Attach Shopify's required headers to the *document* response.
  const headers = new Headers();

  // The helper signature is: addDocumentResponseHeaders(headers, { request })
  if (typeof context?.addDocumentResponseHeaders === "function") {
    context.addDocumentResponseHeaders(headers, { request });
  }

  return json({ ok: true }, { headers });
};

// Pass through the headers we set in the loader
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
