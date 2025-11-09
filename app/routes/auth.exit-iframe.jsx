import { unauthenticated } from "../shopify.server";

export const loader = ({ request }) => unauthenticated.exitIframe(request);
