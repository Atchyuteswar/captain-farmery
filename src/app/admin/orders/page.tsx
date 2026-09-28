import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function AdminOrdersListPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: true
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-lg">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-background border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-primary">
                      <Link href={`/admin/orders/${order.id}`}>
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="p-4 text-sm">{order.createdAt.toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="font-medium text-sm">{order.user?.name || "Guest"}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm">₹{order.grandTotal.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>Manage</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
