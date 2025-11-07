import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  ButtonGroup,
  Text,
  BlockStack,
  InlineStack,
  Divider,
  Select,
  Toast,
  Frame,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { id } = params;

  if (id === "new") {
    return json({ template: null, shop: session.shop });
  }

  const template = await prisma.optionTemplate.findUnique({
    where: { id },
    include: {
      options: {
        include: {
          values: {
            orderBy: { position: "asc" }
          }
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

  return json({ template, shop: session.shop });
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "save") {
    const data = JSON.parse(formData.get("data"));
    const { id } = params;

    if (id === "new") {
      // Create new template
      await prisma.optionTemplate.create({
        data: {
          shop: session.shop,
          name: data.name,
          description: data.description,
          options: {
            create: data.options.map((opt, idx) => ({
              name: opt.name,
              position: idx,
              values: {
                create: opt.values.map((val, valIdx) => ({
                  value: val.value,
                  label: val.label,
                  position: valIdx
                }))
              }
            }))
          }
        }
      });
      
      return redirect("/app");
    } else {
      // Update existing template
      await prisma.optionTemplate.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description
        }
      });
      
      return json({ success: true });
    }
  }

  if (action === "delete") {
    await prisma.optionTemplate.delete({
      where: { id: params.id }
    });
    return redirect("/app");
  }

  return json({ success: false });
}

export default function TemplateEditor() {
  const { template, shop } = useLoaderData();
  const submit = useSubmit();
  const navigate = useNavigate();

  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [options, setOptions] = useState(
    template?.options || [
      { name: "Shirt Type", values: [{ value: "", label: "" }] }
    ]
  );
  const [showToast, setShowToast] = useState(false);

  const handleSave = useCallback(() => {
    const data = { name, description, options };
    const formData = new FormData();
    formData.append("action", "save");
    formData.append("data", JSON.stringify(data));
    submit(formData, { method: "post" });
    setShowToast(true);
  }, [name, description, options, submit]);

  const addOption = useCallback(() => {
    setOptions([...options, { name: "", values: [{ value: "", label: "" }] }]);
  }, [options]);

  const updateOption = useCallback((index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  }, [options]);

  const removeOption = useCallback((index) => {
    setOptions(options.filter((_, i) => i !== index));
  }, [options]);

  const addValue = useCallback((optionIndex) => {
    const newOptions = [...options];
    newOptions[optionIndex].values.push({ value: "", label: "" });
    setOptions(newOptions);
  }, [options]);

  const updateValue = useCallback((optionIndex, valueIndex, field, value) => {
    const newOptions = [...options];
    newOptions[optionIndex].values[valueIndex][field] = value;
    setOptions(newOptions);
  }, [options]);

  const removeValue = useCallback((optionIndex, valueIndex) => {
    const newOptions = [...options];
    newOptions[optionIndex].values = newOptions[optionIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setOptions(newOptions);
  }, [options]);

  const toastMarkup = showToast ? (
    <Toast content="Template saved" onDismiss={() => setShowToast(false)} />
  ) : null;

  return (
    <Frame>
      <Page
        title={template ? "Edit Template" : "Create Template"}
        backAction={{ onAction: () => navigate("/app") }}
        primaryAction={{
          content: "Save",
          onAction: handleSave,
        }}
        secondaryActions={
          template
            ? [
                {
                  content: "Delete",
                  destructive: true,
                  onAction: () => {
                    if (confirm("Are you sure you want to delete this template?")) {
                      const formData = new FormData();
                      formData.append("action", "delete");
                      submit(formData, { method: "post" });
                    }
                  },
                },
              ]
            : []
        }
      >
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <FormLayout>
                  <TextField
                    label="Template Name"
                    value={name}
                    onChange={setName}
                    autoComplete="off"
                    placeholder="e.g., Shirt Options Template"
                  />
                  <TextField
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    autoComplete="off"
                    multiline={3}
                    placeholder="Optional description"
                  />
                </FormLayout>

                <Divider />

                <Text variant="headingMd" as="h2">
                  Options
                </Text>

                <BlockStack gap="400">
                  {options.map((option, optionIndex) => (
                    <Card key={optionIndex}>
                      <BlockStack gap="300">
                        <InlineStack align="space-between">
                          <Text variant="headingSm" as="h3">
                            Option {optionIndex + 1}
                          </Text>
                          {options.length > 1 && (
                            <Button
                              plain
                              destructive
                              onClick={() => removeOption(optionIndex)}
                            >
                              Remove
                            </Button>
                          )}
                        </InlineStack>

                        <TextField
                          label="Option Name"
                          value={option.name}
                          onChange={(value) => updateOption(optionIndex, "name", value)}
                          placeholder="e.g., Shirt Type, Size, Brand"
                        />

                        <BlockStack gap="200">
                          <Text variant="bodyMd" as="p">
                            Values
                          </Text>
                          {option.values.map((value, valueIndex) => (
                            <InlineStack key={valueIndex} gap="200" align="start">
                              <div style={{ flex: 1 }}>
                                <TextField
                                  label=""
                                  value={value.value}
                                  onChange={(val) =>
                                    updateValue(optionIndex, valueIndex, "value", val)
                                  }
                                  placeholder="Value (e.g., Crewneck)"
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <TextField
                                  label=""
                                  value={value.label || ""}
                                  onChange={(val) =>
                                    updateValue(optionIndex, valueIndex, "label", val)
                                  }
                                  placeholder="Display label (optional)"
                                />
                              </div>
                              {option.values.length > 1 && (
                                <Button
                                  icon="delete"
                                  onClick={() => removeValue(optionIndex, valueIndex)}
                                />
                              )}
                            </InlineStack>
                          ))}
                          <Button size="slim" onClick={() => addValue(optionIndex)}>
                            Add Value
                          </Button>
                        </BlockStack>
                      </BlockStack>
                    </Card>
                  ))}
                </BlockStack>

                <Button onClick={addOption}>Add Option</Button>
              </BlockStack>
            </Card>
          </Layout.Section>

          {template && (
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Rules
                  </Text>
                  <Text variant="bodyMd" as="p" tone="subdued">
                    Configure conditional logic for this template
                  </Text>
                  <Button
                    onClick={() => navigate(`/app/templates/${template.id}/rules`)}
                  >
                    Manage Rules
                  </Button>
                </BlockStack>
              </Card>
            </Layout.Section>
          )}
        </Layout>
      </Page>
      {toastMarkup}
    </Frame>
  );
}
