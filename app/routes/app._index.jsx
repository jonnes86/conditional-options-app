import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Text, Card, BlockStack, Banner } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ appName: "Conditional Product Options" });
};

export default function Index() {
  const { appName } = useLoaderData();

  return (
    <Page>
      <ui-title-bar title={appName} />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingMd">Welcome to {appName}! 🎉</Text>
              <Banner tone="success">
                <p>✅ App deployed and running</p>
              </Banner>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}