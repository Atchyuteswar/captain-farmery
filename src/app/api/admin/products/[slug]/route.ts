import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    // Verify admin access
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { slug: currentSlug } = await params;
    const body = await request.json();
    const { name, slug, description, basePrice, categoryId, status } = body;

    const updatedProduct = await prisma.product.update({
      where: { slug: currentSlug },
      data: {
        name,
        slug,
        description,
        basePrice,
        categoryId,
        status
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error.code === 'P2002') {
      return new NextResponse("Slug already exists", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    // Verify admin access
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
