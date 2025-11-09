// app/routes/auth/$.jsx
import shopify from '~/shopify.server';
import { useRouteError } from '@remix-run/react';
import { boundary } from '@shopify/shopify-app-remix/server';

// This route handles: /auth, /auth/callback, /auth/exit-iframe, etc.
export async function loader({ request }) {
  await shopify.authenticate.admin(request);
  return null;
}

export const headers = (args) => boundary.headers(args);
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}
