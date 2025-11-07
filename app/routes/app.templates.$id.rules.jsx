import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Select,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Toast,
  Frame,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { id } = params;

  const template = await prisma.optionTemplate.findUnique({
    where: { id },
    include: {
      options: {
        include: {
          values: { orderBy: { position: "asc" } }
        },
        orderBy: { position: "asc" }
      },
      rules: {
        include: {
          fromOption: true,
          fromValue: true,
          toOption: true,
          allowedValues: true
        }
      }
    }
  });

  if (!template || template.shop !== session.shop) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ template });
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "addRule") {
    const data = JSON.parse(formData.get("data"));
    
    await prisma.rule.create({
      data: {
        templateId: params.id,
        fromOptionId: data.fromOptionId,
        fromValueId: data.fromValueId,
        toOptionId: data.toOptionId,
        allowedValues: {
          connect: data.allowedValueIds.map(id => ({ id }))
        }
      }
    });

    return json({ success: true });
  }

  if (action === "deleteRule") {
    const ruleId = formData.get("ruleId");
    await prisma.rule.delete({
      where: { id: ruleId }
    });
    return json({ success: true });
  }

  return json({ success: false });
}

export default function Rules() {
  const { template } = useLoaderData();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [fromOptionId, setFromOptionId] = useState("");
  const [fromValueId, setFromValueId] = useState("");
  const [toOptionId, setToOptionId] = useState("");
  const [allowedValueIds, setAllowedValueIds] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const fromOption = template.options.find(o => o.id === fromOptionId);
  const toOption = template.options.find(o => o.id === toOptionId);

  const handleAddRule = useCallback(() => {
    if (!fromOptionId || !fromValueId || !toOptionId || allowedValueIds.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    const data = {
      fromOptionId,
      fromValueId,
      toOptionId,
      allowedValueIds
    };

    const formData = new FormData();
    formData.append("action", "addRule");
    formData.append("data", JSON.stringify(data));
    submit(formData, { method: "post" });
    
    // Reset form
    setFromOptionId("");
    setFromValueId("");
    setToOptionId("");
    setAllowedValueIds([]);
    setShowToast(true);
  }, [fromOptionId, fromValueId, toOptionId, allowedValueIds, submit]);

  const handleDeleteRule = useCallback((ruleId) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      const formData = new FormData();
      formData.append("action", "deleteRule");
      formData.append("ruleId", ruleId);
      submit(formData, { method: "post" });
    }
  }, [submit]);

  const toggleAllowedValue = useCallback((valueId) => {
    setAllowedValueIds(prev => 
      prev.includes(valueId)
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId]
    );
  }, []);

  const toastMarkup = showToast ? (
    <Toast content="Rule saved" onDismiss={() => setShowToast(false)} />
  ) : null;

  return (
    <Frame>
      <Page
        title={`Rules: ${template.name}`}
        backAction={{ onAction: () => navigate(`/app/templates/${template.id}`) }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Add New Rule
                </Text>

                <Text variant="bodyMd" as="p">
                  Create conditional logic: "When [option] is [value], show these values for [option]"
                </Text>

                <BlockStack gap="300">
                  <Select
                    label="When this option"
                    options={[
                      { label: "Select option", value: "" },
                      ...template.options.map(o => ({ label: o.name, value: o.id }))
                    ]}
                    value={fromOptionId}
                    onChange={setFromOptionId}
                  />

                  {fromOption && (
                    <Select
                      label="Is this value"
                      options={[
                        { label: "Select value", value: "" },
                        ...fromOption.values.map(v => ({ label: v.value, value: v.id }))
                      ]}
                      value={fromValueId}
                      onChange={setFromValueId}
                    />
                  )}

                  <Select
                    label="Then for this option"
                    options={[
                      { label: "Select option", value: "" },
                      ...template.options
                        .filter(o => o.id !== fromOptionId)
                        .map(o => ({ label: o.name, value: o.id }))
                    ]}
                    value={toOptionId}
                    onChange={setToOptionId}
                  />

                  {toOption && (
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="p" fontWeight="semibold">
                        Show these values:
                      </Text>
                      <InlineStack gap="200" wrap>
                        {toOption.values.map(value => (
                          <Button
                            key={value.id}
                            pressed={allowedValueIds.includes(value.id)}
                            onClick={() => toggleAllowedValue(value.id)}
                          >
                            {value.value}
                          </Button>
                        ))}
                      </InlineStack>
                    </BlockStack>
                  )}

                  <Button variant="primary" onClick={handleAddRule}>
                    Add Rule
                  </Button>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Existing Rules ({template.rules.length})
                </Text>

                {template.rules.length === 0 ? (
                  <Text variant="bodyMd" as="p" tone="subdued">
                    No rules yet. Add your first rule above.
                  </Text>
                ) : (
                  <BlockStack gap="300">
                    {template.rules.map(rule => (
                      <Card key={rule.id}>
                        <InlineStack align="space-between">
                          <BlockStack gap="100">
                            <Text variant="bodyMd" as="p">
                              When <strong>{rule.fromOption.name}</strong> is{" "}
                              <Badge tone="info">{rule.fromValue.value}</Badge>
                            </Text>
                            <Text variant="bodyMd" as="p">
                              Then <strong>{rule.toOption.name}</strong> shows:{" "}
                              <InlineStack gap="100">
                                {rule.allowedValues.map(v => (
                                  <Badge key={v.id}>{v.value}</Badge>
                                ))}
                              </InlineStack>
                            </Text>
                          </BlockStack>
                          <Button
                            plain
                            destructive
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            Delete
                          </Button>
                        </InlineStack>
                      </Card>
                    ))}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      {toastMarkup}
    </Frame>
  );
}
