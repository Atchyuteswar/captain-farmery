import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to leave a review." }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, content } = body;

    if (!productId || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user has purchased the item
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: { in: ["DELIVERED", "CONFIRMED", "SHIPPED"] }
        }
      }
    });

    // Create the review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title,
        body: content,
        isVerifiedPurchase: !!hasPurchased,
        status: "APPROVED", // Auto-approve for now, could be PENDING in real world
      }
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, review });

  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
