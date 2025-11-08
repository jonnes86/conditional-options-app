import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";

// ✅ Let Remix/esbuild handle JSON; no import assertion
import en from "@shopify/polaris/locales/en.json";

// ✅ Include Polaris CSS via <link> using ?url
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => ([
  { rel: "stylesheet", href: polarisStyles },
  { rel: "icon", href: "/favicon.ico" }
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
        <AppProvider i18n={en}>
          <Outlet />
        </AppProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
