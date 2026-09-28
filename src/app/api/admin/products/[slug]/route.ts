import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { slug: currentSlug } = await params;
    const body = await request.json();
    const {
      name, slug, shortDescription, description, basePrice, compareAtPrice,
      categoryId, status, sku, brand, weight,
      isFeatured, isNew, isBestSeller,
      metaTitle, metaDesc, metaKeywords,
      taxRate, returnPolicy,
      images, variants
    } = body;

    // Update product fields
    const updatedProduct = await prisma.product.update({
      where: { slug: currentSlug },
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
      },
      include: { variants: true },
    });

    // Replace images: delete old and create new
    if (images !== undefined) {
      await prisma.productImage.deleteMany({ where: { productId: updatedProduct.id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((img: any, index: number) => ({
            productId: updatedProduct.id,
            url: img.url,
            alt: img.alt || name,
            sortOrder: index,
            isDefault: index === 0,
          })),
        });
      }
    }

    // Replace variants: delete old and create new
    if (variants !== undefined) {
      await prisma.productVariant.deleteMany({ where: { productId: updatedProduct.id } });
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((v: any, index: number) => ({
            productId: updatedProduct.id,
            name: v.name,
            sku: v.sku || `${sku || slug}-${v.name.toLowerCase().replace(/\s+/g, '-')}`,
            price: parseFloat(v.price),
            compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
            options: v.options || { size: v.name },
            isDefault: index === 0,
            sortOrder: index,
          })),
        });
      }
    }

    // Handle Inventory Upsert
    let warehouse = await prisma.warehouse.findFirst();
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: { name: "Main Warehouse", address: "Local", city: "Local", state: "Local", pincode: "000000" }
      });
    }

    if (variants !== undefined && variants.length > 0) {
      const refreshedProduct = await prisma.product.findUnique({
        where: { id: updatedProduct.id },
        include: { variants: true }
      });
      for (const [index, v] of variants.entries()) {
        const updatedVariant = refreshedProduct!.variants[index];
        await prisma.inventory.upsert({
          where: { variantId: updatedVariant.id },
          create: {
            variantId: updatedVariant.id,
            warehouseId: warehouse.id,
            quantity: parseInt(v.quantity) || 0,
            trackInventory: body.inventory?.trackInventory ?? true,
            lowStockThreshold: parseInt(body.inventory?.lowStockThreshold) || 5
          },
          update: {
            quantity: parseInt(v.quantity) || 0,
            trackInventory: body.inventory?.trackInventory ?? true,
            lowStockThreshold: parseInt(body.inventory?.lowStockThreshold) || 5
          }
        });
      }
    } else {
      await prisma.inventory.upsert({
        where: { productId: updatedProduct.id },
        create: {
          productId: updatedProduct.id,
          warehouseId: warehouse.id,
          quantity: parseInt(body.quantity) || 0,
          trackInventory: body.inventory?.trackInventory ?? true,
          lowStockThreshold: parseInt(body.inventory?.lowStockThreshold) || 5
        },
        update: {
          quantity: parseInt(body.quantity) || 0,
          trackInventory: body.inventory?.trackInventory ?? true,
          lowStockThreshold: parseInt(body.inventory?.lowStockThreshold) || 5
        }
      });
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id: updatedProduct.id },
      include: { images: true, variants: true, category: true, inventory: true },
    });

    return NextResponse.json(finalProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A product with this slug or SKU already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { slug } = await params;

    await prisma.product.delete({
      where: { slug }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
