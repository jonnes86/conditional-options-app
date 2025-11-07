import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  if (!shop || !productId) {
    return json({ error: "Missing shop or productId" }, { status: 400 });
  }

  // Find the template assigned to this product
  const productTemplate = await prisma.productTemplate.findUnique({
    where: {
      shop_productId: {
        shop,
        productId: productId.toString()
      }
    },
    include: {
      template: {
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
      }
    }
  });

  if (!productTemplate) {
    return json({ template: null });
  }

  // Transform rules into a more frontend-friendly format
  const rulesMap = {};
  productTemplate.template.rules.forEach(rule => {
    const key = `${rule.fromOptionId}_${rule.fromValueId}_${rule.toOptionId}`;
    rulesMap[key] = rule.allowedValues.map(v => v.id);
  });

  return json({
    template: {
      id: productTemplate.template.id,
      name: productTemplate.template.name,
      options: productTemplate.template.options,
      rulesMap
    }
  });
}
