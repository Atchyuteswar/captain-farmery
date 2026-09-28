"use client";

import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

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
  variants: Variant[];
  basePrice: number;
  compareAtPrice: number | null;
}

export default function VariantSelector({
  productId,
  productName,
  productImage,
  variants,
  basePrice,
  compareAtPrice,
}: VariantSelectorProps) {
  const defaultVariant = variants.find(v => v.isDefault) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const price = selectedVariant ? selectedVariant.price : basePrice;
  const compare = selectedVariant ? selectedVariant.compareAtPrice : compareAtPrice;

  return (
    <>
      {/* Price */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl font-bold text-primary">₹{price.toFixed(2)}</span>
        {compare && (
          <span className="text-xl text-muted-foreground line-through">₹{compare.toFixed(2)}</span>
        )}
      </div>

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
                  {options.size || variant.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
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
        <Button size="lg" variant="outline" className="h-14 w-14 rounded-full p-0 shrink-0">
          <Heart className="w-6 h-6 text-muted-foreground" />
        </Button>
      </div>
    </>
  );
}
