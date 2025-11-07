import { useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Select,
  Button,
  Toast,
  Frame,
  Thumbnail,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);

  // Fetch products from Shopify
  const response = await admin.rest.resources.Product.all({
    session,
    limit: 50,
  });

  // Get existing assignments
  const assignments = await prisma.productTemplate.findMany({
    where: { shop: session.shop },
    include: { template: true }
  });

  const assignmentMap = {};
  assignments.forEach(a => {
    assignmentMap[a.productId] = a.template;
  });

  // Get all templates
  const templates = await prisma.optionTemplate.findMany({
    where: { shop: session.shop },
    orderBy: { name: "asc" }
  });

  return json({
    products: response.data,
    assignmentMap,
    templates,
    shop: session.shop
  });
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const productId = formData.get("productId");
  const templateId = formData.get("templateId");

  if (!templateId || templateId === "") {
    // Remove assignment
    await prisma.productTemplate.deleteMany({
      where: {
        shop: session.shop,
        productId: productId
      }
    });
  } else {
    // Create or update assignment
    await prisma.productTemplate.upsert({
      where: {
        shop_productId: {
          shop: session.shop,
          productId: productId
        }
      },
      create: {
        shop: session.shop,
        productId: productId,
        templateId: templateId
      },
      update: {
        templateId: templateId
      }
    });
  }

  return json({ success: true });
}

export default function Products() {
  const { products, assignmentMap, templates } = useLoaderData();
  const submit = useSubmit();
  const [showToast, setShowToast] = useState(false);

  const handleAssignTemplate = useCallback((productId, templateId) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("templateId", templateId);
    submit(formData, { method: "post" });
    setShowToast(true);
  }, [submit]);

  const templateOptions = [
    { label: "No template", value: "" },
    ...templates.map(t => ({ label: t.name, value: t.id }))
  ];

  const toastMarkup = showToast ? (
    <Toast content="Product updated" onDismiss={() => setShowToast(false)} />
  ) : null;

  return (
    <Frame>
      <Page title="Assign Templates to Products">
        <Layout>
          <Layout.Section>
            <Card>
              <ResourceList
                resourceName={{ singular: "product", plural: "products" }}
                items={products}
                renderItem={(product) => {
                  const { id, title, images, status } = product;
                  const media = images?.[0] ? (
                    <Thumbnail
                      source={images[0].src}
                      alt={title}
                      size="small"
                    />
                  ) : null;
                  
                  const assignedTemplate = assignmentMap[id.toString()];

                  return (
                    <ResourceItem
                      id={id}
                      media={media}
                      verticalAlignment="center"
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <div style={{ flex: 1 }}>
                          <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {title}
                          </Text>
                          {assignedTemplate && (
                            <Badge tone="success">{assignedTemplate.name}</Badge>
                          )}
                        </div>
                        <div style={{ width: "300px" }}>
                          <Select
                            label=""
                            labelHidden
                            options={templateOptions}
                            value={assignedTemplate?.id || ""}
                            onChange={(value) => handleAssignTemplate(id.toString(), value)}
                          />
                        </div>
                      </div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      {toastMarkup}
    </Frame>
  );
}
