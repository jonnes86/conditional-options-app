// app/entry.server.jsx
import { PassThrough } from "node:stream";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";

export default function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const stream = new PassThrough();

    const { pipe, abort } = renderToPipeableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");
          stream.on("error", reject);
          resolve(new Response(stream, { headers: responseHeaders, status: didError ? 500 : responseStatusCode }));
          pipe(stream);
        },
        onShellError(err) {
          reject(err);
        },
        onError(err) {
          didError = true;
          console.error(err);
        },
      }
    );

    setTimeout(abort, 5000);
  });
}
