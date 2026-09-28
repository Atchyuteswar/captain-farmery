"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative" 
      onClick={() => toggleCart()}
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && getTotalItems() > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          {getTotalItems()}
        </span>
      )}
      <span className="sr-only">Cart</span>
    </Button>
  );
}
