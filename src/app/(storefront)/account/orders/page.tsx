import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ExternalLink } from "lucide-react";

export default async function AccountOrdersPage() {
  const session = await auth();
  
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">View and track your previous orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-background border rounded-3xl p-12 text-center flex flex-col items-center">
          <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-xl mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders with us yet.</p>
          <Link href="/shop" className="text-primary font-bold hover:underline">
            Start Shopping &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-background border rounded-3xl p-6 transition-all hover:shadow-subtle">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Placed: {order.createdAt.toLocaleDateString()}
                  </p>
                  <p className="font-bold text-lg">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end gap-2">
                  <p className="font-bold text-xl">₹{order.grandTotal.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.paymentStatus === "PAID" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Tracking info will appear here once shipped.
                </p>
                <Link 
                  href={`/account/orders/${order.id}`}
                  className="flex items-center text-sm font-medium text-primary hover:underline"
                >
                  View Details <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
