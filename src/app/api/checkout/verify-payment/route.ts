import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    
    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment is verified — update order and payment status in database
    const payment = await prisma.payment.findFirst({
      where: { providerOrderId: razorpay_order_id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          providerPaymentId: razorpay_payment_id,
          status: "PAID",
          webhookVerified: true,
        },
      });

      const order = await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
        include: { items: true, user: true, shippingAddress: true }
      });

      // Clear the DB cart if user is logged in
      if (order.userId) {
        await prisma.cart.deleteMany({
          where: { userId: order.userId }
        });
      }

      // Deduct inventory
      for (const item of order.items) {
        const inventory = await prisma.inventory.findFirst({
          where: item.variantId ? { variantId: item.variantId } : { productId: item.productId, variantId: null }
        });
        if (inventory && inventory.trackInventory) {
          await prisma.inventory.update({
            where: { id: inventory.id },
            data: {
              quantity: { decrement: item.quantity }
            }
          });
          // Log movement
          await prisma.inventoryMovement.create({
            data: {
              inventoryId: inventory.id,
              quantity: -item.quantity,
              type: "SALE",
              referenceId: order.id,
              notes: "Order placed"
            }
          });
        }
      }

      // Add timeline entry
      await prisma.orderTimeline.create({
        data: {
          orderId: payment.orderId,
          status: "CONFIRMED",
          notes: "Payment received and verified via Razorpay.",
        },
      });
      
      // Send Confirmation Email
      try {
        const customerEmail = order.user?.email || order.guestEmail;
        const customerName = order.shippingAddress?.fullName || order.user?.name || "Customer";
        
        if (customerEmail) {
          await sendOrderConfirmationEmail({
            email: customerEmail,
            customerName: customerName,
            orderNumber: order.orderNumber,
            total: order.grandTotal,
            items: order.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.unitPrice
            }))
          });
        }
      } catch (err) {
        console.error("Failed to send order confirmation email:", err);
      }

      revalidatePath("/", "layout");

      return NextResponse.json({ success: true, orderId: payment.orderId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
