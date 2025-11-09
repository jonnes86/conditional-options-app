// app/routes/app.jsx
import { json } from '@remix-run/node';
import { useLoaderData, useRouteError } from '@remix-run/react';
import shopify from '~/shopify.server';
import { boundary } from '@shopify/shopify-app-remix/server';

export async function loader({ request }) {
  const { session } = await shopify.authenticate.admin(request);
  return json({ shop: session.shop }, { headers: { 'Cache-Control': 'no-store' } });
}

export const headers = (args) => boundary.headers(args);
export function ErrorBoundary() { return boundary.error(useRouteError()); }

export default function App() {
  const { shop } = useLoaderData();
  return (
    <main style={{ padding: 16 }}>
      <h1>Conditional Options App</h1>
      <p>Installed on: {shop}</p>
    </main>
  );
}
