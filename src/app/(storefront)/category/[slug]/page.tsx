import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import ShopControls from "@/components/catalog/ShopControls";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} | Captain Farmery`,
    description: category.description || `Shop ${category.name} products from Captain Farmery.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const sort = sParams.sort || "featured";

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { basePrice: "asc" };
  else if (sort === "price-desc") orderBy = { basePrice: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "ACTIVE" },
        include: { images: { take: 1 } },
        orderBy,
      }
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div>
      {/* Category Header */}
      <div className="bg-bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground text-lg md:text-xl">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-border pb-6">
          <p className="text-muted-foreground font-medium">Showing {category.products.length} products</p>
          
          <ShopControls
            categories={[{ slug: category.slug, name: category.name }]}
            currentSort={sort}
            currentCategory={category.slug}
          />
        </div>

        {/* Product Grid */}
        {category.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                shortDescription={product.shortDescription}
                basePrice={product.basePrice}
                compareAtPrice={product.compareAtPrice}
                imageUrl={product.images?.[0]?.url}
                isNew={product.isNew}
                isBestSeller={product.isBestSeller}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-muted rounded-3xl">
            <h3 className="font-serif text-2xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground">We are working on adding products to this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
