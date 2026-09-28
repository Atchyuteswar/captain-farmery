import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // In a real scenario, you'd aggregate these stats from the DB
  const stats = [
    { label: "Total Revenue", value: "₹1,24,500", icon: DollarSign, trend: "+12%" },
    { label: "Total Orders", value: "342", icon: ShoppingBag, trend: "+5%" },
    { label: "Active Customers", value: "1,204", icon: Users, trend: "+18%" },
    { label: "Avg. Order Value", value: "₹364", icon: TrendingUp, trend: "+2%" },
  ];

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                {stat.trend}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-background border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">
            View All &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4">
                      <div className="font-medium">{order.user?.name || "Guest"}</div>
                      <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm">{order.createdAt.toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold">₹{order.grandTotal.toFixed(2)}</td>
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
