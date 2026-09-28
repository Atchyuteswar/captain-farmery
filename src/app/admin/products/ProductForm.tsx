"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Image as ImageIcon, Package, Tag, Search, Layers, BarChart3, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  url: string;
  alt: string;
}

interface ProductVariant {
  name: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  quantity: string;
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
  const [activeTab, setActiveTab] = useState("basic");
  
  // Basic info
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    brand: product?.brand || "",
    basePrice: product?.basePrice?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    categoryId: product?.categoryId || categories[0]?.id || "",
    status: product?.status || "DRAFT",
    weight: product?.weight?.toString() || "",
    taxRate: product?.taxRate?.toString() || "0",
    returnPolicy: product?.returnPolicy || "",
    isFeatured: product?.isFeatured || false,
    isNew: product?.isNew || false,
    isBestSeller: product?.isBestSeller || false,
    metaTitle: product?.metaTitle || "",
    metaDesc: product?.metaDesc || "",
    metaKeywords: product?.metaKeywords || "",
    quantity: product?.inventory?.quantity?.toString() || "0",
  });

  // Inventory
  const [inventory, setInventory] = useState({
    trackInventory: product?.inventory?.trackInventory ?? true,
    lowStockThreshold: product?.inventory?.lowStockThreshold?.toString() || "5",
  });

  // Images
  const [images, setImages] = useState<ProductImage[]>(
    product?.images?.map((img: any) => ({ url: img.url, alt: img.alt || "" })) || []
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants?.map((v: any) => ({
      name: v.name,
      sku: v.sku || "",
      price: v.price?.toString() || "",
      compareAtPrice: v.compareAtPrice?.toString() || "",
      quantity: v.inventory?.quantity?.toString() || "0",
    })) || []
  );

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: isEdit ? formData.slug : generateSlug(name),
      sku: isEdit ? formData.sku : generateSlug(name),
    });
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, { url: newImageUrl.trim(), alt: formData.name }]);
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", sku: "", price: formData.basePrice, compareAtPrice: "", quantity: "0" }]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    // Auto-generate SKU for variant
    if (field === "name" && !isEdit) {
      updated[index].sku = `${formData.sku || formData.slug}-${value.toLowerCase().replace(/\s+/g, '-')}`;
    }
    setVariants(updated);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit ? `/api/admin/products/${product.slug}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        taxRate: formData.taxRate ? parseFloat(formData.taxRate) : 0,
        images,
        variants: variants.filter(v => v.name.trim() !== ""),
        inventory: {
          trackInventory: inventory.trackInventory,
          lowStockThreshold: parseInt(inventory.lowStockThreshold) || 5,
        }
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(isEdit ? "Product updated!" : "Product created!");
        router.push("/admin/products");
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.error || "Failed to save product");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "variants", label: "Variants & Pricing", icon: Layers },
    { id: "inventory", label: "Inventory", icon: BarChart3 },
    { id: "seo", label: "SEO", icon: Search },
    { id: "shipping", label: "Shipping & Tax", icon: Truck },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className={`${buttonVariants({ variant: "outline", size: "icon" })} rounded-full`}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground">
            {isEdit ? `Editing: ${product?.name}` : 'Fill in the product details across each section'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
            className="border rounded-full px-4 py-2 bg-background text-sm font-medium"
          >
            <option value="DRAFT">🔴 Draft</option>
            <option value="ACTIVE">🟢 Active</option>
            <option value="ARCHIVED">📦 Archived</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "variants" && variants.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">{variants.length}</span>
              )}
              {tab.id === "images" && images.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">{images.length}</span>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========== BASIC INFO ========== */}
        {activeTab === "basic" && (
          <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name <span className="text-destructive">*</span></label>
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
                <label className="text-sm font-medium">URL Slug <span className="text-destructive">*</span></label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">/product/</span>
                  <input 
                    required
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                    placeholder="organic-gir-cow-ghee"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU <span className="text-destructive">*</span></label>
                <input 
                  required
                  type="text"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                  placeholder="GHE-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <input 
                  type="text"
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                  placeholder="Captain Farmery"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
                <select 
                  required
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price (₹) <span className="text-destructive">*</span></label>
                <input 
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={e => setFormData({...formData, basePrice: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                  placeholder="499.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock (Qty)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                  placeholder="Leave 0 if using variants"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>
              <input 
                type="text"
                value={formData.shortDescription}
                onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                placeholder="A brief one-liner about the product (shown on cards)"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">{formData.shortDescription.length}/200 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Description</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary resize-none"
                placeholder="Detailed product description (supports line breaks)..."
              />
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Product Badges</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: "isFeatured", label: "⭐ Featured", color: "bg-purple-100 text-purple-800 border-purple-200" },
                  { key: "isNew", label: "🆕 New Arrival", color: "bg-blue-100 text-blue-800 border-blue-200" },
                  { key: "isBestSeller", label: "🔥 Best Seller", color: "bg-amber-100 text-amber-800 border-amber-200" },
                ].map(badge => {
                  const isActive = (formData as any)[badge.key];
                  return (
                    <button
                      key={badge.key}
                      type="button"
                      onClick={() => setFormData({...formData, [badge.key]: !isActive})}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                        isActive ? badge.color : "bg-muted/30 text-muted-foreground border-border"
                      }`}
                    >
                      {badge.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========== IMAGES ========== */}
        {activeTab === "images" && (
          <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Product Images
            </h2>
            <p className="text-sm text-muted-foreground">Add product images via URL. The first image will be used as the main product image.</p>

            {/* Image grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden bg-muted border-2 border-border">
                  <Image src={img.url} alt={img.alt} fill className="object-cover" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MAIN</span>
                  )}
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1.5">
                    <input
                      type="text"
                      value={img.alt}
                      onChange={e => {
                        const updated = [...images];
                        updated[index] = { ...updated[index], alt: e.target.value };
                        setImages(updated);
                      }}
                      className="w-full text-[10px] bg-transparent text-white placeholder-white/50 focus:outline-none"
                      placeholder="Alt text..."
                    />
                  </div>
                </div>
              ))}
              
              {/* Add image input */}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center p-4 gap-2">
                <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="w-full text-xs border rounded-lg px-2 py-1.5 bg-muted/30 text-center"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                />
                <Button type="button" variant="outline" size="xs" onClick={addImage} className="rounded-full text-xs">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========== VARIANTS ========== */}
        {activeTab === "variants" && (
          <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" /> Variants & Pricing
              </h2>
              <Button type="button" variant="outline" onClick={addVariant} className="rounded-full">
                <Plus className="w-4 h-4 mr-2" /> Add Variant
              </Button>
            </div>
            
            {variants.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium mb-1">No variants yet</p>
                <p className="text-sm mb-4">Add variants like "500g", "1 Kg", "250ml" etc. Each variant can have its own price and SKU.</p>
                <Button type="button" variant="outline" onClick={addVariant} className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" /> Add First Variant
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Compare At Price for base product */}
                <div className="bg-muted/30 rounded-2xl p-4 mb-4">
                  <label className="text-sm font-medium">Compare-At Price (₹)</label>
                  <p className="text-xs text-muted-foreground mb-2">Set a higher "original" price to show a strikethrough discount on the storefront.</p>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={e => setFormData({...formData, compareAtPrice: e.target.value})}
                    className="w-full md:w-64 border rounded-xl px-4 py-3 bg-background focus:ring-primary focus:border-primary"
                    placeholder="799.00"
                  />
                </div>

                {/* Variant rows */}
                <div className="space-y-3">
                  <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-medium text-muted-foreground px-2">
                    <div className="col-span-3">Variant Name</div>
                    <div className="col-span-2">SKU</div>
                    <div className="col-span-2">Price (₹)</div>
                    <div className="col-span-2">Compare-At (₹)</div>
                    <div className="col-span-2">Stock Qty</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-muted/20 rounded-2xl border items-center">
                      <div className="md:col-span-3">
                        <input
                          required
                          type="text"
                          value={variant.name}
                          onChange={e => updateVariant(index, "name", e.target.value)}
                          className="w-full border rounded-xl px-3 py-2 text-sm bg-background"
                          placeholder="e.g. 500g, 1 Kg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={e => updateVariant(index, "sku", e.target.value)}
                          className="w-full border rounded-xl px-3 py-2 text-sm bg-background"
                          placeholder="Auto-generated"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          required
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={e => updateVariant(index, "price", e.target.value)}
                          className="w-full border rounded-xl px-3 py-2 text-sm bg-background"
                          placeholder="Price"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.compareAtPrice}
                          onChange={e => updateVariant(index, "compareAtPrice", e.target.value)}
                          className="w-full border rounded-xl px-3 py-2 text-sm bg-background"
                          placeholder="Optional"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          required
                          type="number"
                          min="0"
                          value={variant.quantity}
                          onChange={e => updateVariant(index, "quantity", e.target.value)}
                          className="w-full border rounded-xl px-3 py-2 text-sm bg-background"
                          placeholder="Stock"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeVariant(index)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== INVENTORY ========== */}
        {activeTab === "inventory" && (
          <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Inventory Management
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Configure how stock is tracked and when you are alerted.</p>
            
            <div className="bg-muted/30 p-6 rounded-2xl border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Track Inventory</h3>
                  <p className="text-sm text-muted-foreground">Automatically decrease stock when orders are placed.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={inventory.trackInventory}
                    onChange={e => setInventory({...inventory, trackInventory: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {inventory.trackInventory && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium mb-2 block">Low Stock Threshold</label>
                  <p className="text-xs text-muted-foreground mb-3">You will be alerted when stock reaches this amount or below.</p>
                  <input 
                    type="number"
                    min="0"
                    value={inventory.lowStockThreshold}
                    onChange={e => setInventory({...inventory, lowStockThreshold: e.target.value})}
                    className="w-full md:w-48 border rounded-xl px-4 py-3 bg-background focus:ring-primary focus:border-primary"
                    placeholder="5"
                  />
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex gap-3 mt-6">
              <Package className="w-5 h-5 shrink-0" />
              <div className="text-sm">
                <span className="font-bold block mb-1">Note about Variants</span>
                If you have variants (e.g. 500g, 1Kg), stock quantities are managed on the "Variants & Pricing" tab. If you have no variants, the total stock quantity is set on the "Basic Info" tab.
              </div>
            </div>
          </div>
        )}


        {/* ========== SEO ========== */}
        {activeTab === "seo" && (
          <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> SEO & Discoverability
            </h2>
            <p className="text-sm text-muted-foreground">Optimize how this product appears in Google search results. Leave blank to auto-generate from product name.</p>
            
            {/* Preview */}
            <div className="bg-muted/30 rounded-2xl p-4 border">
              <p className="text-xs text-muted-foreground mb-1">Google Search Preview</p>
              <p className="text-blue-700 text-lg font-medium truncate">{formData.metaTitle || formData.name || "Product Title"} | Captain Farmery</p>
              <p className="text-green-700 text-sm">{(process.env.NEXT_PUBLIC_APP_URL || "captain-farmery.vercel.app").replace(/^https?:\/\//, '')}/product/{formData.slug || "..."}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{formData.metaDesc || formData.shortDescription || "Product description will appear here..."}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Title</label>
              <input 
                type="text"
                value={formData.metaTitle}
                onChange={e => setFormData({...formData, metaTitle: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                placeholder={formData.name || "Product page title for search engines"}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">{(formData.metaTitle || "").length}/60 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description</label>
              <textarea 
                rows={3}
                value={formData.metaDesc}
                onChange={e => setFormData({...formData, metaDesc: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary resize-none"
                placeholder="Write a compelling description for search results (150-160 characters ideal)"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">{(formData.metaDesc || "").length}/160 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <input 
                type="text"
                value={formData.metaKeywords}
                onChange={e => setFormData({...formData, metaKeywords: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                placeholder="organic, ghee, farm fresh, natural (comma-separated)"
              />
            </div>
          </div>
        )}

        {/* ========== SHIPPING & TAX ========== */}
        {activeTab === "shipping" && (
          <div className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold border-b pb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping & Tax
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (grams)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Rate (%)</label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={e => setFormData({...formData, taxRate: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Return Policy</label>
              <textarea 
                rows={3}
                value={formData.returnPolicy}
                onChange={e => setFormData({...formData, returnPolicy: e.target.value})}
                className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary resize-none"
                placeholder="e.g. 7-day return policy for damaged items. No returns on opened food products."
              />
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 bg-muted/30 border rounded-2xl p-4">
          <Link href="/admin/products" className={`${buttonVariants({ variant: "ghost" })} rounded-full px-6`}>Cancel</Link>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {formData.status === "DRAFT" && (
              <Button 
                type="submit" 
                variant="outline"
                disabled={isSubmitting} 
                className="rounded-full px-6 flex-1 sm:flex-none"
                onClick={() => setFormData({...formData, status: "DRAFT"})}
              >
                Save as Draft
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="rounded-full px-8 shadow-lift flex-1 sm:flex-none"
              onClick={() => { if (formData.status === "DRAFT") setFormData({...formData, status: "ACTIVE"}); }}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Publish Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
