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
    // Intentionally ignoring client-side pricing to prevent tampering
    const { items, formData, shippingAddressId: clientAddressId, couponCode } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Securely calculate prices from database
    let secureSubtotal = 0;
    const orderItemsForDB = [];

    for (const item of items) {
      // Fetch fresh product/variant data from DB
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!product) continue;

      let actualPrice = product.basePrice;
      let variantName = null;

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          actualPrice = variant.price;
          variantName = variant.name;
        } else {
          return NextResponse.json({ error: `The variant for ${product.name} is no longer available. Please remove it from your cart and add it again.` }, { status: 400 });
        }
      }

      secureSubtotal += actualPrice * item.quantity;

      orderItemsForDB.push({
        productId: item.productId,
        variantId: item.variantId || null,
        name: product.name,
        sku: item.productId, // fallback
        quantity: item.quantity,
        unitPrice: actualPrice,
        totalPrice: actualPrice * item.quantity,
        productSnapshot: {
          name: product.name,
          price: actualPrice,
          image: item.image,
          variantName: variantName,
        },
      });

      // Check inventory
      const inventory = await prisma.inventory.findFirst({
        where: item.variantId ? { variantId: item.variantId } : { productId: item.productId, variantId: null }
      });

      if (inventory && inventory.trackInventory && inventory.quantity < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.name} ${variantName ? `(${variantName})` : ''}` }, { status: 400 });
      }
    }

    // 2. Shipping calculation
    const shippingAmount = secureSubtotal > 999 ? 0 : 50;

    // 3. Discount calculation
    let discountAmount = 0;
    if (couponCode === "WELCOME10") {
      discountAmount = secureSubtotal * 0.1;
    }

    const grandTotal = secureSubtotal + shippingAmount - discountAmount;
    const amountInPaise = Math.round(grandTotal * 100);

    // 4. Create order in Razorpay
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 5. Save order in DB
    // 5. Save order in DB
    let shippingAddressId: string | undefined = clientAddressId;
    if (!shippingAddressId && formData?.address && formData?.city && formData?.pincode) {
      const addressData: any = {
        fullName: `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Customer",
        phone: formData.phone || "",
        line1: formData.address,
        city: formData.city,
        state: formData.state || "",
        pincode: formData.pincode,
      };
      
      if (session?.user?.id) {
        addressData.userId = session.user.id;
      }
      
      const address = await prisma.address.create({
        data: addressData,
      });
      shippingAddressId = address.id;
    }

    const orderData: any = {
      orderNumber: razorpayOrder.id,
      subtotal: secureSubtotal,
      shippingAmount: shippingAmount,
      discount: discountAmount,
      grandTotal: grandTotal,
      status: "PENDING",
      paymentStatus: "UNPAID",
      currency: "INR",
      items: {
        create: orderItemsForDB,
      },
    };

    if (session?.user?.id) {
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

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "dummy_key",
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
