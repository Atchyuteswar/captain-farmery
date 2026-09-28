"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  
  // Prevent hydration mismatch for persisted store
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Your cart is empty.</p>
              <Link href="/shop" onClick={() => setIsOpen(false)} className={`${buttonVariants({ variant: "default" })} rounded-full mt-4`}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-2xl">
                <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden shrink-0 relative">
                  <Image 
                    src={item.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200&auto=format&fit=crop"} 
                    alt={item.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-foreground line-clamp-1">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {item.variantName && (
                    <span className="text-xs text-muted-foreground">{item.variantName}</span>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-3 bg-background border rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-6 bg-secondary/50 border-t space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Subtotal</span>
              <span className="text-primary">₹{getTotalPrice().toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Taxes and shipping calculated at checkout.
            </p>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className={`${buttonVariants({ variant: "default" })} w-full h-12 rounded-xl text-base shadow-lift flex items-center justify-center`}>
              Checkout Securely
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
