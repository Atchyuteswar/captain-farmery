import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminFAQsPage() {
  // @ts-ignore
  const faqClient = prisma.faq || prisma.fAQ;
  const faqs = await faqClient.findMany({
    orderBy: { sortOrder: "asc" }
  });

  async function deleteFAQ(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
      // @ts-ignore
      const faqClient = prisma.faq || prisma.fAQ;
      await faqClient.delete({ where: { id } });
      revalidatePath("/admin/faqs");
      revalidatePath("/");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">Manage your common questions</p>
        </div>
        <Link href="/admin/faqs/new" className={buttonVariants({ variant: "default" })}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Link>
      </div>

      <div className="bg-background border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground text-sm border-b">
              <th className="p-4 font-medium w-16">Sort</th>
              <th className="p-4 font-medium">Question</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No FAQs found. Create one to get started.
                </td>
              </tr>
            ) : (
              faqs.map((faq: any) => (
                <tr key={faq.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4">{faq.sortOrder}</td>
                  <td className="p-4 font-medium">{faq.question}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${faq.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                      {faq.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/faqs/${faq.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteFAQ}>
                        <input type="hidden" name="id" value={faq.id} />
                        <Button type="submit" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
  );
}
