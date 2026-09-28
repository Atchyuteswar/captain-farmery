"use client";

import { useCartStore, CartItem } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Omit<CartItem, 'id' | 'quantity'>;
  variant: "icon" | "full";
}

export default function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a link
    addItem({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  if (variant === "icon") {
    return (
      <Button 
        size="icon" 
        className="rounded-full h-10 w-10 shadow-lift"
        onClick={handleAddToCart}
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="sr-only">Add to cart</span>
      </Button>
    );
  }

  return (
    <Button 
      size="lg" 
      className="flex-1 h-14 rounded-full text-lg shadow-lift"
      onClick={handleAddToCart}
    >
      <ShoppingBag className="w-5 h-5 mr-2" />
      Add to Cart
    </Button>
  );
}
