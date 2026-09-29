import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewCategoryPage() {
  async function createCategory(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";
    const sortOrder = parseInt(formData.get("sortOrder") as string || "0");

    if (!name || !slug) return;

    await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isActive,
        sortOrder
      }
    });

    revalidatePath("/", "layout");
    redirect("/admin/categories");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Category</h1>
      </div>

      <form action={createCategory} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Category Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Pure Honey"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug (URL friendly)</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g., pure-honey"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea 
              id="description" 
              name="description" 
              className="w-full p-2 border rounded-md h-24"
              placeholder="Brief description of the category..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="sortOrder" className="block text-sm font-medium mb-1">Sort Order</label>
              <input 
                type="number" 
                id="sortOrder" 
                name="sortOrder" 
                defaultValue="0"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex-1 flex items-end">
              <label className="flex items-center gap-2 pb-2">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Active (Visible)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <Link href="/admin/categories" className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm font-medium">
            Cancel
          </Link>
          <Button type="submit">
            Create Category
          </Button>
        </div>
      </form>
    </div>
  );
}
