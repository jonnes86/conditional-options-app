import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";

import polarisStyles from "@shopify/polaris/build/esm/styles.css";

export const links = () => ([
  { rel: "stylesheet", href: "https://unpkg.com/@shopify/polaris@12.13.0/build/esm/styles.css" }
]);

export const meta = () => ([
  { charSet: "utf-8" },
  { title: "Conditional Options" },
  { name: "viewport", content: "width=device-width,initial-scale=1" }
]);

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* Pass an empty i18n object to avoid importing JSON on the server */}
        <AppProvider i18n={{}}>
          <Outlet />
        </AppProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
