import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5,
      select: {
        id: true,
        slug: true,
        name: true,
        basePrice: true,
        images: {
          take: 1,
          select: { url: true }
        }
      }
    });

    // Fire and forget search history logging
    const session = await auth();
    prisma.searchHistory.create({
      data: {
        query,
        resultCount: products.length,
        userId: session?.user?.id || null,
      }
    }).catch(console.error);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
