import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReturnActionDialog from "./ReturnActionDialog";
import { format } from "date-fns";

export default async function AdminReturnsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    notFound();
  }

  const returns = await prisma.returnRequest.findMany({
    include: {
      order: {
        select: { orderNumber: true, grandTotal: true, paymentStatus: true }
      },
      user: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground">Manage customer return requests</p>
        </div>
      </div>

      <div className="bg-background border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Request Date</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Order</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Customer</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Reason</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No return requests found.
                  </td>
                </tr>
              ) : (
                returns.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      {format(new Date(req.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/admin/orders/${req.orderId}`} className="text-primary hover:underline">
                        #{req.order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div>{req.user.name}</div>
                      <div className="text-xs text-muted-foreground">{req.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{req.reason}</div>
                      <div className="text-xs text-muted-foreground">Cond: {req.condition || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        req.status === "APPROVED" || req.status === "REFUNDED" 
                          ? "bg-green-100 text-green-800" 
                          : req.status === "REJECTED" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReturnActionDialog returnRequest={req} />
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
