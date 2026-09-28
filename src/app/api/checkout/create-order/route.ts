import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const { items, totalAmount, shippingAmount, discountAmount, formData, shippingAddressId: clientAddressId } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Convert amount to paise (multiply by 100)
    const grandTotal = totalAmount + (shippingAmount || 0) - (discountAmount || 0);
    const amountInPaise = Math.round(grandTotal * 100);

    // Create order in Razorpay
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order + order items in DB
    if (session?.user?.id) {
      // Optionally save the shipping address
      let shippingAddressId: string | undefined = clientAddressId;
      if (!shippingAddressId && formData?.address && formData?.city && formData?.pincode) {
        const address = await prisma.address.create({
          data: {
            userId: session.user.id,
            fullName: `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Customer",
            phone: formData.phone || "",
            line1: formData.address,
            city: formData.city,
            state: formData.state || "",
            pincode: formData.pincode,
          },
        });
        shippingAddressId = address.id;
      }

      const orderData: any = {
        orderNumber: razorpayOrder.id,
        subtotal: totalAmount,
        shippingAmount: shippingAmount || 0,
        discount: discountAmount || 0,
        grandTotal: grandTotal,
        status: "PENDING",
        paymentStatus: "UNPAID",
        currency: "INR",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            name: item.name,
            sku: item.productId, // fallback SKU
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            productSnapshot: {
              name: item.name,
              price: item.price,
              image: item.image,
              variantName: item.variantName,
            },
          })),
        },
      };

      if (session.user.id) {
        orderData.user = { connect: { id: session.user.id } };
      }
      
      if (shippingAddressId) {
        orderData.shippingAddress = { connect: { id: shippingAddressId } };
      }

      const order = await prisma.order.create({
        data: orderData,
      });

      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "RAZORPAY",
          providerOrderId: razorpayOrder.id,
          amount: grandTotal,
          status: "UNPAID",
        },
      });
    }

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "dummy_key",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
