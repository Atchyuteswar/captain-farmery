import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // Verify admin access
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const flow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const timelineEntriesToCreate = [];
    const currentIndex = flow.indexOf(order.status);
    const newIndex = flow.indexOf(status);

    if (currentIndex !== -1 && newIndex !== -1 && newIndex > currentIndex) {
      // Add all missing intermediate statuses sequentially
      for (let i = currentIndex + 1; i <= newIndex; i++) {
        // Offset timestamps by 1 second each to ensure correct chronological sorting
        const offsetDate = new Date(Date.now() - ((newIndex - i) * 1000));
        timelineEntriesToCreate.push({
          status: flow[i],
          notes: i === newIndex 
            ? `Order status updated to ${flow[i]} by admin.` 
            : `System automatically progressed order to ${flow[i]}.`,
          createdAt: offsetDate
        });
      }
    } else {
      // It's a jump backwards, or to/from CANCELLED/RETURNED. Just add the new status.
      timelineEntriesToCreate.push({
        status,
        notes: `Order status updated to ${status} by admin.`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        timeline: {
          create: timelineEntriesToCreate
        }
      }
    });

    revalidatePath("/", "layout");

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
