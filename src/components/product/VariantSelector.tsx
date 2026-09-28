"use client";

import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Zap } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Variant {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  options: any;
  isDefault: boolean;
}

interface VariantSelectorProps {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  variants: Variant[];
  basePrice: number;
  compareAtPrice: number | null;
}

export default function VariantSelector({
  productId,
  productName,
  productImage,
  productSlug,
  variants,
  basePrice,
  compareAtPrice,
}: VariantSelectorProps) {
  const router = useRouter();
  const defaultVariant = variants.find(v => v.isDefault) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useWishlistStore();
  const { addItem: addToCart, setIsOpen } = useCartStore();

  const price = selectedVariant ? selectedVariant.price : basePrice;
  const compare = selectedVariant ? selectedVariant.compareAtPrice : compareAtPrice;
  const discount = compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0;

  const handleBuyNow = () => {
    addToCart({
      productId,
      name: productName,
      price,
      image: productImage,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      quantity,
    });
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleWishlist = () => {
    addItem({ productId, name: productName, price, slug: productSlug, image: productImage });
    toast.success("Added to wishlist!");
  };

  return (
    <>
      {/* Price */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-3xl font-bold text-primary">₹{price.toFixed(2)}</span>
        {compare && compare > price && (
          <>
            <span className="text-xl text-muted-foreground line-through">₹{compare.toFixed(2)}</span>
            <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              {discount}% off
            </span>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-6">Inclusive of all taxes</p>

      {/* Variants */}
      {variants.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold mb-4">Select Size</h3>
          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => {
              const options = variant.options as any;
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-6 py-3 rounded-full border-2 text-sm font-bold transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {options?.size || variant.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Quantity</h3>
        <div className="flex items-center gap-1 bg-muted/50 border rounded-full w-fit px-2 py-1">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-background rounded-full transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-bold text-lg">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="p-2 hover:bg-background rounded-full transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <AddToCartButton
          variant="full"
          product={{
            productId: productId,
            name: productName,
            price: price,
            image: productImage,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
          }}
        />
        <Button 
          size="lg" 
          variant="secondary"
          className="flex-1 h-14 rounded-full text-lg font-bold"
          onClick={handleBuyNow}
        >
          <Zap className="w-5 h-5 mr-2" />
          Buy Now
        </Button>
      </div>
      <div className="flex gap-3 mb-12">
        <Button 
          size="lg" 
          variant="outline" 
          className="h-12 rounded-full px-6 gap-2"
          onClick={handleWishlist}
        >
          <Heart className="w-5 h-5" />
          Add to Wishlist
        </Button>
      </div>
    </>
  );
}
