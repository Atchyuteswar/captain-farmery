import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await req.json(); // local cart items
    const userId = session.user.id;

    // Get or create DB cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true, variant: true } } }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true, variant: true } } }
      });
    }

    // Merge logic: for each local item, upsert into DB
    for (const localItem of items) {
      const existing = cart.items.find(
        (i) => i.productId === localItem.productId && i.variantId === (localItem.variantId || null)
      );

      if (existing) {
        // If DB has less quantity than local, we might want to update it.
        // For simplicity, let's just take the max of local or DB quantity.
        const newQty = Math.max(existing.quantity, localItem.quantity);
        if (newQty !== existing.quantity) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: newQty }
          });
        }
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: localItem.productId,
            variantId: localItem.variantId || null,
            quantity: localItem.quantity
          }
        });
      }
    }

    // If local items were empty but DB has items (e.g. logging in on a new device),
    // we want to return the DB items so the client can populate its store.
    
    // Refetch the unified cart
    const unifiedCart = await prisma.cart.findUnique({
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

    // Format DB items back into the Zustand CartItem format
    const formattedItems = unifiedCart?.items.map(item => ({
      id: `${item.productId}-${item.variantId || 'default'}`,
      productId: item.productId,
      name: item.product.name,
      price: item.variant ? item.variant.price : item.product.basePrice,
      quantity: item.quantity,
      image: item.product.images?.[0]?.url,
      variantId: item.variantId || undefined,
      variantName: item.variant ? Object.values(item.variant.options as Record<string, string>).join(' / ') : undefined,
    })) || [];

    return NextResponse.json({ items: formattedItems });

  } catch (error) {
    console.error("Cart sync error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
