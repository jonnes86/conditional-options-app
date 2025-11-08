import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";

// ✅ Import styles as a URL for Remix to attach via <link>, not a runtime CSS import
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

// Add your own global CSS this same way if you have one:
// import globalStyles from "./styles/global.css?url";

export const links = () => {
  return [
    { rel: "stylesheet", href: polarisStyles },
    // { rel: "stylesheet", href: globalStyles },
    { rel: "icon", href: "/favicon.ico" } // avoids the /favicon.ico 404 noise
  ];
};

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
