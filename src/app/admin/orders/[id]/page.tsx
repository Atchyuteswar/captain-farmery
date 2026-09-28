import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, MapPin, CreditCard } from "lucide-react";
import OrderStatusSelect from "./OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: { product: true }
      },
      payment: true,
      shippingAddress: true
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Order #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-muted-foreground">Placed on {order.createdAt.toLocaleString()}</p>
          </div>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6 pb-2 border-b">Order Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-muted rounded-xl shrink-0 overflow-hidden relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200&auto=format&fit=crop" 
                      alt="Product"
                      fill
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-1">{item.product?.name || "Unknown Product"}</h3>
                    <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{order.shippingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4">
                <span>Total</span>
                <span>₹{order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
          <div className="bg-background border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" /> Customer
            </h2>
            <div className="space-y-1">
              <p className="font-medium">{order.user?.name || "Guest Checkout"}</p>
              <p className="text-sm text-muted-foreground">{order.user?.email}</p>
            </div>
          </div>

          <div className="bg-background border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" /> Payment
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.payment?.provider || "N/A"}</span>
              </div>
              {order.payment?.providerPaymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium text-xs break-all">{order.payment.providerPaymentId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-background border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" /> Shipping Address
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {order.shippingAddress ? (
                <>
                  {order.shippingAddress.fullName}<br/>
                  {order.shippingAddress.line1}<br/>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </>
              ) : "No shipping address provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
