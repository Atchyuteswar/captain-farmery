import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, adminNotes, refundAmount } = await req.json();

    const returnRequest = await prisma.returnRequest.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
        refundAmount: refundAmount !== undefined ? parseFloat(refundAmount) : undefined
      }
    });

    // If fully refunded, mark the order as RETURNED
    if (status === "REFUNDED") {
      await prisma.order.update({
        where: { id: returnRequest.orderId },
        data: { status: "RETURNED" }
      });
    }

    revalidatePath("/", "layout");

    return NextResponse.json(returnRequest);
  } catch (error) {
    console.error("Failed to update return:", error);
    return NextResponse.json(
      { error: "Failed to update return request" },
      { status: 500 }
    );
  }
}
