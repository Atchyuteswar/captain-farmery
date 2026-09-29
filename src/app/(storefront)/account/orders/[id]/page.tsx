import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, Receipt, CheckCircle2, Clock, Truck, XCircle, RotateCcw, CreditCard } from "lucide-react";
import ReturnRequestForm from "./ReturnRequestForm";

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING': return <Clock className="w-5 h-5" />;
    case 'PROCESSING': return <Package className="w-5 h-5" />;
    case 'CONFIRMED': return <CreditCard className="w-5 h-5" />;
    case 'SHIPPED': return <Truck className="w-5 h-5" />;
    case 'DELIVERED': return <CheckCircle2 className="w-5 h-5" />;
    case 'CANCELLED': return <XCircle className="w-5 h-5" />;
    case 'RETURNED': return <RotateCcw className="w-5 h-5" />;
    default: return <CheckCircle2 className="w-5 h-5" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING': return 'bg-amber-100 text-amber-600 border-amber-200';
    case 'CANCELLED': return 'bg-red-100 text-red-600 border-red-200';
    case 'DELIVERED': return 'bg-primary text-primary-foreground border-white';
    default: return 'bg-blue-100 text-blue-600 border-white';
  }
};

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const { id } = await params;
  
  if (!session?.user?.id) return null;

  const order = await prisma.order.findUnique({
    where: { 
      id: id,
      userId: session.user.id // Ensure user can only view their own orders
    },
    include: {
      items: true,
      shippingAddress: true,
      timeline: {
        orderBy: { createdAt: "desc" }
      },
      shipments: true,
      returns: true
    }
  });

  if (!order) {
    notFound();
  }

  // Format dates
  const orderDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.createdAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/account/orders" className="text-sm font-medium text-muted-foreground hover:text-primary mb-4 flex items-center gap-1 w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-1">Order #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-muted-foreground">Placed on {orderDate}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">
              {order.status}
            </span>
            <span className={`px-4 py-2 text-sm font-bold rounded-full ${
              order.paymentStatus === "PAID" 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Items & Timeline */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Items */}
          <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Items Ordered
            </h2>
            
            <div className="space-y-4">
              {order.items.map((item) => {
                const snapshot = item.productSnapshot as any;
                return (
                  <div key={item.id} className="flex gap-4 items-start py-4 border-b last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0 relative border">
                      <Image src={snapshot?.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{snapshot?.variantName || "Standard"}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm font-medium bg-muted px-2 py-1 rounded">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          {order.timeline.length > 0 && (
            <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Order Updates
              </h2>
              <div className="relative pl-3 md:pl-4 space-y-8 before:absolute before:inset-y-0 before:left-[1.65rem] md:before:left-[1.9rem] before:w-0.5 before:bg-border before:-z-10">
                {order.timeline.map((event, i) => (
                  <div key={event.id} className="relative flex items-start gap-4 md:gap-6">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 shadow-sm bg-background ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="font-bold text-base text-foreground mb-1">{event.status}</div>
                      <time className="text-sm text-muted-foreground block mb-2">
                        {new Date(event.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} @ {new Date(event.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </time>
                      {event.notes && <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border inline-block">{event.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
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
            
            <div className="flex justify-between font-bold text-xl pt-4">
              <span>Total:</span>
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

          {/* Shipment Tracking */}
          {order.shipments && order.shipments.length > 0 && (
            <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-muted-foreground" /> Tracking Details
              </h2>
              <div className="space-y-4">
                {order.shipments.map(shipment => (
                  <div key={shipment.id} className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrier:</span>
                      <span className="font-medium">{shipment.provider || "Standard Shipping"}</span>
                    </div>
                    {shipment.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracking #:</span>
                        <span className="font-medium">{shipment.trackingNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="px-2 py-1 bg-muted rounded-md font-medium text-xs">
                        {shipment.status}
                      </span>
                    </div>
                    {shipment.trackingUrl && (
                      <a 
                        href={shipment.trackingUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block mt-4 text-center w-full py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                      >
                        Track Package
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Returns & Support */}
          <div className="bg-background rounded-3xl p-6 shadow-sm border border-border/50">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-muted-foreground" /> Returns & Support
            </h2>
            
            {order.returns && order.returns.length > 0 ? (
              <div className="space-y-3 text-sm">
                <div className="bg-muted p-4 rounded-xl border border-border/50">
                  <p className="font-bold mb-2 text-base flex items-center gap-2">
                    Return Status: 
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      order.returns[0].status === "APPROVED" || order.returns[0].status === "REFUNDED" 
                        ? "bg-green-100 text-green-800" 
                        : order.returns[0].status === "REJECTED" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {order.returns[0].status}
                    </span>
                  </p>
                  <p><span className="text-muted-foreground">Reason:</span> {order.returns[0].reason}</p>
                  <p><span className="text-muted-foreground">Method:</span> {order.returns[0].refundMethod}</p>
                  {order.returns[0].adminNotes && (
                    <div className="mt-3 p-2 bg-background rounded border text-muted-foreground">
                      <strong>Note from admin:</strong> {order.returns[0].adminNotes}
                    </div>
                  )}
                </div>
              </div>
            ) : order.status === "DELIVERED" ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  You can request a return within 7 days of delivery.
                </p>
                <ReturnRequestForm orderId={order.id} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Returns can only be requested after the order has been delivered.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
