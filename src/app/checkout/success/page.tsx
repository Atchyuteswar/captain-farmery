import Link from "next/link";
import { CheckCircle2, ChevronRight, Package, MapPin, Receipt, Calendar } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const { orderId } = await searchParams;

  let order = null;
  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
      },
    });
  }

  if (!order) {
    // Fallback if no order ID is provided or found
    return (
      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Thank you for shopping with Captain Farmery. Your pure, farm-fresh products are being prepared and will be shipped soon.
        </p>
        <Link href="/shop" className={`${buttonVariants({ variant: "default" })} rounded-full px-8`}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Format date
  const orderDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.createdAt);

  // Delivery estimate (e.g. 3-5 days from now)
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryEstimate = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    day: "numeric",
  }).format(deliveryDate);

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Success Header */}
        <div className="bg-background rounded-3xl p-8 shadow-sm border border-border/50 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">Thank you, your order has been placed!</h1>
          <p className="text-muted-foreground">
            We've sent a confirmation email with your order details.
          </p>
          <div className="mt-6 inline-block bg-muted/50 rounded-lg px-6 py-3 border border-border/50">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Delivery Info */}
            <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Delivery Estimate
              </h2>
              <p className="text-lg font-medium text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-100 inline-block">
                Arriving by {deliveryEstimate}
              </p>
              
              <div className="mt-8 space-y-4">
                <h3 className="font-bold border-b pb-2">Items ordered</h3>
                {order.items.map((item) => {
                  const snapshot = item.productSnapshot as any;
                  return (
                    <div key={item.id} className="flex gap-4 items-start py-2">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0 relative border">
                        <Image src={snapshot?.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{snapshot?.variantName || "Standard"}</p>
                        <p className="text-sm font-medium mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Order Summary */}
            <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-muted-foreground" /> Order Summary
              </h2>
              
              <div className="space-y-3 text-sm pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items Subtotal:</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>{order.shippingAmount === 0 ? "Free" : `₹${order.shippingAmount.toFixed(2)}`}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-4">
                <span>Grand Total:</span>
                <span className="text-primary">₹{order.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" /> Shipping Address
                </h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                  <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link href={`/account/orders/${order.id}`} className={`${buttonVariants({ variant: "default" })} w-full rounded-xl shadow-sm`}>
                View Order Status
              </Link>
              <Link href="/shop" className={`${buttonVariants({ variant: "outline" })} w-full rounded-xl`}>
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
