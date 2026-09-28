import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Check, X, Trash2 } from "lucide-react";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, user: true }
  });

  async function updateReviewStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as any;
    
    if (id && status) {
      await prisma.review.update({
        where: { id },
        data: { status }
      });
      revalidatePath("/admin/reviews");
      revalidatePath("/");
    }
  }

  async function deleteReview(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    
    if (id) {
      await prisma.review.delete({
        where: { id }
      });
      revalidatePath("/admin/reviews");
      revalidatePath("/");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">Manage and moderate customer reviews</p>
      </div>

      <div className="bg-background border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium max-w-md">Review</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">
                      {review.user?.name || "Anonymous"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {review.product?.name || "Unknown Product"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-amber-500">
                        {review.rating} / 5
                      </div>
                    </td>
                    <td className="p-4 text-sm max-w-md truncate" title={review.body}>
                      {review.body}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        review.status === "APPROVED" ? "bg-green-50 text-green-600" : 
                        review.status === "REJECTED" ? "bg-red-50 text-red-600" :
                        "bg-yellow-50 text-yellow-600"
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {review.status !== "APPROVED" && (
                          <form action={updateReviewStatus}>
                            <input type="hidden" name="id" value={review.id} />
                            <input type="hidden" name="status" value="APPROVED" />
                            <Button type="submit" variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Approve">
                              <Check className="w-4 h-4" />
                            </Button>
                          </form>
                        )}
                        {review.status !== "REJECTED" && (
                          <form action={updateReviewStatus}>
                            <input type="hidden" name="id" value={review.id} />
                            <input type="hidden" name="status" value="REJECTED" />
                            <Button type="submit" variant="ghost" size="icon" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50" title="Reject">
                              <X className="w-4 h-4" />
                            </Button>
                          </form>
                        )}
                        <form action={deleteReview}>
                          <input type="hidden" name="id" value={review.id} />
                          <Button type="submit" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
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
