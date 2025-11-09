import { unauthenticated } from "../shopify.server";

// Sends the HTML/JS that redirects the top window back to our app
export const loader = ({ request }) => unauthenticated.exitIframe(request);
