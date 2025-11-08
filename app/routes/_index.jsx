// app/routes/_index.jsx
export default function Index() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>It works 🎉</h1>
      <p>If you can see this, your Remix shell is rendering on Railway.</p>
      <p>
        Next step is wiring Shopify auth / embedded UI. If you open this inside Shopify Admin,
        ensure the app is embedded and CSP allows <code>frame-ancestors</code> from Shopify.
      </p>
    </div>
  );
}
