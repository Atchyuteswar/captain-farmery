"use client";

import { Heart } from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface WishlistButtonProps {
  product: WishlistItem;
  variant?: "card" | "pdp";
}

export default function WishlistButton({ product, variant = "card" }: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(product.productId) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (inWishlist) {
      toast.success(`Removed from wishlist`);
    } else {
      toast.success(`Added to wishlist!`);
    }
  };

  if (variant === "card") {
    return (
      <button
        onClick={handleToggle}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white text-muted-foreground hover:text-destructive transition-colors"
      >
        <Heart className={`w-5 h-5 ${inWishlist ? "fill-destructive text-destructive" : ""}`} />
        <span className="sr-only">{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
      </button>
    );
  }

  return null;
}
