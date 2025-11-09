// app/routes/favicon.ico.jsx
export const loader = async () =>
  new Response(null, { status: 204, headers: { "Cache-Control": "public, max-age=86400" } });
