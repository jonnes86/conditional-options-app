// app/routes/auth.exit-iframe.jsx
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  // Shopify provides ?exitIframe=<absolute-or-relative-URL>
  const redirectTo = url.searchParams.get("exitIframe") || "/app";

  const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function() {
        var target = ${JSON.stringify(redirectTo)};
        if (window.top === window.self) {
          // Not embedded: just go there
          window.location.href = target;
        } else {
          // Embedded: bust out of iframe
          window.top.location.href = target;
        }
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
