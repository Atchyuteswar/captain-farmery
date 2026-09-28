import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/cart/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  basePrice: number;
  compareAtPrice?: number | null;
  imageUrl?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export default function ProductCard({
  id,
  slug,
  name,
  shortDescription,
  basePrice,
  compareAtPrice,
  imageUrl,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  console.log("ProductCard rendered for:", id, name, "basePrice:", basePrice);
  // Use placeholder image if none provided
  const image = imageUrl || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="group relative bg-background rounded-3xl overflow-hidden shadow-subtle hover:shadow-card transition-all duration-500 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isBestSeller && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
        {isNew && (
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        {compareAtPrice && compareAtPrice > basePrice && (
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Sale {Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)}% Off
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <WishlistButton product={{ productId: id, name, price: basePrice, slug, image: imageUrl }} />

      {/* Image Container */}
      <Link href={`/product/${slug}`} className="block aspect-[4/5] overflow-hidden bg-muted relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link href={`/product/${slug}`} className="block mb-2">
          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        {shortDescription && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground">
              ₹{Number(basePrice || 0).toFixed(2)}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{Number(compareAtPrice || 0).toFixed(2)}
              </span>
            )}
          </div>
          
          <AddToCartButton 
            variant="icon" 
            product={{
              productId: id,
              name: name,
              price: basePrice,
              image: image
            }} 
          />
        </div>
      </div>
    </div>
  );
}
