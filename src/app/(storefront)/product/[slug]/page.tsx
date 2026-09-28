import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";
import VariantSelector from "@/components/product/VariantSelector";

export const revalidate = 3600;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const productImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-muted rounded-[40px] overflow-hidden relative">
            <Image 
              src={productImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-muted rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary relative">
                <Image 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=300&auto=format&fit=crop" 
                  alt="" 
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Interactive Variant Selector + Add to Cart */}
          <VariantSelector
            productId={product.id}
            productName={product.name}
            productImage={productImage}
            variants={product.variants.map(v => ({
              id: v.id,
              name: v.name,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              options: v.options,
              isDefault: v.isDefault,
            }))}
            basePrice={product.basePrice}
            compareAtPrice={product.compareAtPrice}
          />

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-secondary rounded-3xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div className="text-sm">
                <p className="font-bold">100% Authentic</p>
                <p className="text-muted-foreground">Sourced directly from farms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div className="text-sm">
                <p className="font-bold">Fast Delivery</p>
                <p className="text-muted-foreground">Free shipping over ₹999</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
