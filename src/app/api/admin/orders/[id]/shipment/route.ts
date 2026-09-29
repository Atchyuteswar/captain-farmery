import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { provider, trackingNumber, trackingUrl, status } = await req.json();

    // Check if shipment exists
    const existingShipment = await prisma.shipment.findFirst({
      where: { orderId: id }
    });

    if (existingShipment) {
      await prisma.shipment.update({
        where: { id: existingShipment.id },
        data: { provider, trackingNumber, trackingUrl, status }
      });
    } else {
      await prisma.shipment.create({
        data: {
          orderId: id,
          provider,
          trackingNumber,
          trackingUrl,
          status: status || "SHIPPED",
          shippedAt: new Date()
        }
      });
    }

    // Auto-update order status if shipment is updated
    if (status === "DELIVERED") {
      await prisma.order.update({
        where: { id },
        data: { status: "DELIVERED", fulfillmentStatus: "FULFILLED" }
      });
    } else if (status === "SHIPPED" || status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY") {
      await prisma.order.update({
        where: { id },
        data: { status: "SHIPPED", fulfillmentStatus: "FULFILLED" }
      });
    }
    
    // Create a notification for the customer
    const order = await prisma.order.findUnique({ where: { id } });
    if (order?.userId) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          type: "ORDER_UPDATE",
          title: "Order Shipment Update",
          body: `Your order #${order.id.slice(-8).toUpperCase()} tracking status is now: ${status}.`,
          data: JSON.stringify({ orderId: order.id, trackingUrl })
        }
      });
    }

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update shipment:", error);
    return NextResponse.json(
      { error: "Failed to update shipment" },
      { status: 500 }
    );
  }
}
