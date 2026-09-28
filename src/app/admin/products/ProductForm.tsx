"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

export default function ProductForm({ 
  product, 
  categories,
  isEdit = false
}: { 
  product?: any, 
  categories: Category[],
  isEdit?: boolean 
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    basePrice: product?.basePrice?.toString() || "",
    unit: "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    status: product?.status || "ACTIVE"
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: isEdit ? formData.slug : generateSlug(name) // Auto-generate slug only on create
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/admin/products/${product.slug}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice)
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = await res.text();
        alert(`Failed to save product: ${error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className={`${buttonVariants({ variant: "outline", size: "icon" })} rounded-full`}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground">Fill in the product details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                placeholder="e.g. Organic Gir Cow Ghee"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL friendly) *</label>
              <input 
                required
                type="text"
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                placeholder="e.g. organic-gir-cow-ghee"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary resize-none"
              placeholder="Describe the product..."
            />
          </div>
        </div>

        <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Pricing & Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Price (₹) *</label>
              <input 
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={e => setFormData({...formData, basePrice: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status *</label>
              <select 
                required
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <select 
                required
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center">
            
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className={`${buttonVariants({ variant: "outline" })} rounded-full px-8 h-12 flex items-center`}>Cancel</Link>
          <Button type="submit" disabled={isSubmitting} className="rounded-full px-8 h-12 shadow-lift">
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
