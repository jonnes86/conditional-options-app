import { RemixServer } from "@remix-run/react";
import { renderToReadableStream } from "react-dom/server";

export default function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    { statusCode: responseStatusCode, headers: responseHeaders }
  );
}
