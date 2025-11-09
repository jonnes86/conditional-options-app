// app/routes/auth.exit-iframe.jsx
// Renders a tiny page that kicks the browser out of the iframe and resumes OAuth.
export const loader = async ({ request, context }) => {
  const url = new URL(request.url);
  const exitTo = url.searchParams.get("exitIframe") || "/app";

  const headers = new Headers();
  if (typeof context?.addDocumentResponseHeaders === "function") {
    context.addDocumentResponseHeaders(headers, { request });
  }

  const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script>
      /* Break out of the Shopify Admin iframe and continue the flow */
      window.top.location.href = ${JSON.stringify(exitTo)};
    </script>
  </body>
</html>`;

  return new Response(html, { status: 200, headers });
};

// IMPORTANT: return the headers the loader set
export const headers = ({ loaderHeaders }) => loaderHeaders;
