import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json(); // local wishlist items
    const userId = session.user.id;

    // Get or create DB wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { items: true }
      });
    }

    // Merge logic: for each local item, create if not exists
    for (const localItem of items) {
      const existing = wishlist.items.find(
        (i) => i.productId === localItem.productId && i.variantId === (localItem.variantId || null)
      );

      if (!existing) {
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId: localItem.productId,
            variantId: localItem.variantId || null,
          }
        });
      }
    }

    // Refetch the unified wishlist
    const unifiedWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { 
        items: {
          include: { 
            product: { include: { images: true } }, 
            variant: true 
          }
        }
      }
    });

    // Format DB items back into the Zustand WishlistItem format
    const formattedItems = unifiedWishlist?.items.map(item => ({
      productId: item.productId,
      name: item.product.name,
      price: item.variant ? item.variant.price : item.product.basePrice,
      image: item.product.images?.[0]?.url,
      slug: item.product.slug,
      variantId: item.variantId || undefined,
    })) || [];

    return NextResponse.json({ items: formattedItems });

  } catch (error) {
    console.error("Wishlist sync error:", error);
    return NextResponse.json({ error: "Failed to sync wishlist" }, { status: 500 });
  }
}
