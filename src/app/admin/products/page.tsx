import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Edit } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsListPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      category: true,
      variants: true
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link href="/admin/products/new" className={`${buttonVariants({ variant: "default" })} rounded-lg shadow-lift`}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-background border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Base Price</th>
                <th className="p-4 font-medium">Variants</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-xs text-muted-foreground">/{product.slug}</div>
                    </td>
                    <td className="p-4 text-sm">{product.category?.name || "-"}</td>
                    <td className="p-4 font-bold text-sm">₹{product.basePrice.toFixed(2)}</td>
                    <td className="p-4 text-sm">{product.variants.length}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'ACTIVE' ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.slug}`} className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 rounded-md`}>
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Link>
                        <DeleteProductButton slug={product.slug} name={product.name} />
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
