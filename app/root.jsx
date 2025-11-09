import { addDocumentResponseHeaders } from "./shopify.server";
import { Links, Meta, Outlet, Scripts, LiveReload } from "@remix-run/react";

export const headers = () => {
  // Shopify helper adds the proper CSP including frame-ancestors
  return addDocumentResponseHeaders();
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
