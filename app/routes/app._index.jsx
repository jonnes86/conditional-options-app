import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Page,
  Layout,
  Card,
  Button,
  IndexTable,
  Text,
  EmptyState,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  
  const templates = await prisma.optionTemplate.findMany({
    where: { shop: session.shop },
    include: {
      _count: {
        select: { products: true, options: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return json({ templates });
}

export default function Index() {
  const { templates } = useLoaderData();
  const navigate = useNavigate();

  const rowMarkup = templates.map((template, index) => (
    <IndexTable.Row
      id={template.id}
      key={template.id}
      position={index}
      onClick={() => navigate(`/app/templates/${template.id}`)}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {template.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{template.description || "-"}</IndexTable.Cell>
      <IndexTable.Cell>{template._count.options}</IndexTable.Cell>
      <IndexTable.Cell>{template._count.products}</IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(template.updatedAt).toLocaleDateString()}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page
      title="Conditional Options"
      primaryAction={{
        content: "Create Template",
        onAction: () => navigate("/app/templates/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {templates.length === 0 ? (
              <EmptyState
                heading="Create your first option template"
                action={{
                  content: "Create Template",
                  onAction: () => navigate("/app/templates/new"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>
                  Option templates let you create conditional logic for product options.
                  Set up rules like "if crewneck is selected, only show youth sizes for Gildan brand."
                </p>
              </EmptyState>
            ) : (
              <IndexTable
                resourceName={{ singular: "template", plural: "templates" }}
                itemCount={templates.length}
                headings={[
                  { title: "Name" },
                  { title: "Description" },
                  { title: "Options" },
                  { title: "Products" },
                  { title: "Updated" },
                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
