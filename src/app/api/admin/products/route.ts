import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Verify admin access
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name, slug, shortDescription, description, basePrice, compareAtPrice,
      categoryId, status, sku, brand, weight,
      isFeatured, isNew, isBestSeller,
      metaTitle, metaDesc, metaKeywords,
      taxRate, returnPolicy,
      images, variants
    } = body;

    if (!name || !slug || !basePrice || !categoryId) {
      return NextResponse.json({ error: "Missing required fields: name, slug, basePrice, categoryId" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: sku || slug,
        shortDescription: shortDescription || null,
        description: description || "",
        basePrice: parseFloat(basePrice),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        categoryId,
        status: status || "DRAFT",
        brand: brand || null,
        weight: weight ? parseFloat(weight) : null,
        isFeatured: isFeatured || false,
        isNew: isNew || false,
        isBestSeller: isBestSeller || false,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
        metaKeywords: metaKeywords || null,
        taxRate: taxRate ? parseFloat(taxRate) : 0,
        returnPolicy: returnPolicy || null,
        // Create images
        images: {
          create: (images || []).map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || name,
            sortOrder: index,
            isDefault: index === 0,
          })),
        },
        // Create variants
        variants: {
          create: (variants || []).map((v: any, index: number) => ({
            name: v.name,
            sku: v.sku || `${sku || slug}-${v.name.toLowerCase().replace(/\s+/g, '-')}`,
            price: parseFloat(v.price),
            compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
            options: v.options || { size: v.name },
            isDefault: index === 0,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    // Handle Inventory creation
    let warehouse = await prisma.warehouse.findFirst();
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: { name: "Main Warehouse", address: "Local", city: "Local", state: "Local", pincode: "000000" }
      });
    }

    if (variants && variants.length > 0) {
      for (const [index, v] of variants.entries()) {
        const createdVariant = product.variants[index];
        await prisma.inventory.create({
          data: {
            variantId: createdVariant.id,
            warehouseId: warehouse.id,
            quantity: parseInt(v.quantity) || 0,
            trackInventory: body.inventory?.trackInventory ?? true,
            lowStockThreshold: parseInt(body.inventory?.lowStockThreshold) || 5
          }
        });
      }
    } else {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: parseInt(body.quantity) || 0,
          trackInventory: body.inventory?.trackInventory ?? true,
          lowStockThreshold: parseInt(body.inventory?.lowStockThreshold) || 5
        }
      });
    }

    // Log admin action
    prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE_PRODUCT",
        entityType: "Product",
        entityId: product.id,
        newValue: JSON.stringify({ name: product.name, slug: product.slug })
      }
    }).catch(console.error);

    revalidatePath("/", "layout");

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A product with this slug or SKU already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
