import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";
import "@shopify/polaris/build/esm/styles.css";

export async function loader({ request }) {
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY });
}

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <a href="/app" rel="home">Home</a>
        <a href="/app/products">Assign Products</a>
      </ui-nav-menu>
      {/* Outlet renders the child routes */}
    </AppProvider>
  );
}
