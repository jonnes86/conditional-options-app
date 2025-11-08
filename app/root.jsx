// app/root.jsx
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [
  { rel: "icon", href: "/favicon.ico" },
  { rel: "stylesheet", href: polarisStyles },
];

export const meta = () => ([
  { charSet: "utf-8" },
  { title: "Conditional Options" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
]);

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ minHeight: "100vh", margin: 0 }}>
        {/* Simple top banner so you *always* see something */}
        <div style={{
          padding: "8px 12px",
          background: "#f6f6f7",
          borderBottom: "1px solid #e3e3e3",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}>
          Conditional Options — Remix Shell
        </div>

        <main style={{ padding: 16 }}>
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
