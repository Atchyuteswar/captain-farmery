import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, reason, condition, comments, refundMethod, images } = body;

    if (!orderId || !reason || !refundMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify order belongs to user and is delivered
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "DELIVERED") {
      return NextResponse.json({ error: "Order must be delivered to request a return" }, { status: 400 });
    }

    // Check if a return already exists
    const existingReturn = await prisma.returnRequest.findFirst({
      where: { orderId }
    });

    if (existingReturn) {
      return NextResponse.json({ error: "A return request already exists for this order" }, { status: 400 });
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId,
        userId: session.user.id,
        reason,
        condition,
        comments,
        refundMethod,
        images: images || [],
      }
    });

    // Optionally update order status to RETURN_REQUESTED (not in enum, but good practice, we can just leave it DELIVERED for now)

    return NextResponse.json(returnRequest);
  } catch (error) {
    console.error("Return request error:", error);
    return NextResponse.json({ error: "Failed to create return request" }, { status: 500 });
  }
}
