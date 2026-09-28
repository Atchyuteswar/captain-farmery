import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Verify admin access
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, basePrice, categoryId, status } = body;

    if (!name || !slug || !basePrice || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: slug, // Use slug as default sku
        description,
        basePrice,
        categoryId,
        status
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    if (error.code === 'P2002') {
      return new NextResponse("Slug already exists", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
