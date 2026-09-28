import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, Award, ChevronRight } from "lucide-react";
import VariantSelector from "@/components/product/VariantSelector";
import ReviewSection from "@/components/product/ReviewSection";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Captain Farmery`,
    description: product.shortDescription || product.description || `Buy ${product.name} from Captain Farmery.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const session = await auth();
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
      }
    },
  });

  if (!product) {
    notFound();
  }

  const fallbackImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop";
  const productImages = product.images.length > 0 
    ? product.images.map(img => img.url) 
    : [fallbackImage];
  const mainImage = productImages[0];

  // Delivery estimate: 3-5 business days from now
  const deliveryStart = new Date();
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  const deliveryEnd = new Date();
  deliveryEnd.setDate(deliveryEnd.getDate() + 5);
  const formatDate = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-8 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-3xl overflow-hidden relative">
            <Image 
              src={mainImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square bg-muted rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary relative transition-all">
                  <Image 
                    src={img} 
                    alt={`${product.name} view ${i + 1}`} 
                    fill
                    sizes="(max-width: 1024px) 25vw, 12vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category badge */}
          {product.category && (
            <Link 
              href={`/category/${product.category.slug}`}
              className="text-xs font-bold uppercase tracking-wider text-primary mb-3 hover:underline w-fit"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            {product.name}
          </h1>
          
          {product.shortDescription && (
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Interactive Variant Selector + Add to Cart + Buy Now */}
          <VariantSelector
            productId={product.id}
            productName={product.name}
            productImage={mainImage}
            productSlug={product.slug}
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

          {/* Delivery Estimate */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(deliveryStart)} — {formatDate(deliveryEnd)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Free shipping on orders above ₹999</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-bold">100% Authentic</p>
                <p className="text-muted-foreground">Sourced from farms</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-2xl">
              <Award className="w-6 h-6 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Lab Tested</p>
                <p className="text-muted-foreground">Quality certified</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-2xl">
              <Truck className="w-6 h-6 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Fast Delivery</p>
                <p className="text-muted-foreground">3-5 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-2xl">
              <RefreshCw className="w-6 h-6 text-primary shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Easy Returns</p>
                <p className="text-muted-foreground">7-day return policy</p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="font-serif text-xl font-bold mb-4">Product Description</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewSection productId={product.id} initialReviews={product.reviews} session={session} />
    </div>
  );
}
