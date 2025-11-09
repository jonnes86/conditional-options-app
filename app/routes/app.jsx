import { Outlet } from "@remix-run/react";
// ...
export default function App() {
  // ...
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <a href="/app" rel="home">Home</a>
        <a href="/app/products">Assign Products</a>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}
