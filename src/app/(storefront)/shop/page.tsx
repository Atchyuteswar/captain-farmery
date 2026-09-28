import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import ShopControls from "@/components/catalog/ShopControls"; // Trigger TS server cache rebuild

export const revalidate = 3600;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort || "featured";
  const categoryFilter = params.category || "";

  // Build orderBy
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { basePrice: "asc" };
  else if (sort === "price-desc") orderBy = { basePrice: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };

  // Fetch active products with optional category filter
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(categoryFilter ? { category: { slug: categoryFilter } } : {}),
    },
    include: {
      category: true,
    },
    orderBy,
  });

  // Fetch categories for filter dropdown
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">Shop All Products</h1>
          <p className="text-muted-foreground">Showing {products.length} products</p>
        </div>

        <ShopControls
          categories={categories.map(c => ({ slug: c.slug, name: c.name }))}
          currentSort={sort}
          currentCategory={categoryFilter}
        />
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              shortDescription={product.shortDescription}
              basePrice={product.basePrice}
              compareAtPrice={product.compareAtPrice}
              isNew={product.isNew}
              isBestSeller={product.isBestSeller}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted rounded-3xl">
          <h3 className="font-serif text-2xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try changing your filters or check back soon!</p>
        </div>
      )}
    </div>
  );
}
