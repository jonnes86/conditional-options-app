// app/routes/app._index.jsx
import shopify from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  // you can now use `admin` GraphQL/REST clients or the session/shop info
  return null;
}

export default function Index() {
  return <div>Conditional Options App</div>;
}
