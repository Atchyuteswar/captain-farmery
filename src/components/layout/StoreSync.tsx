"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function StoreSync({ isAuthenticated }: { isAuthenticated: boolean }) {
  const cartItems = useCartStore((state) => state.items);
  const setCartItems = useCartStore((state) => state.setItems);
  
  const wishlistItems = useWishlistStore((state) => state.items);
  const setWishlistItems = useWishlistStore((state) => state.setItems);

  const hasSyncedInitial = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial sync on mount if authenticated
    const performInitialSync = async () => {
      try {
        // Sync Cart
        const cartRes = await fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems }),
        });
        if (cartRes.ok) {
          const { items } = await cartRes.json();
          setCartItems(items);
        }

        // Sync Wishlist
        const wishlistRes = await fetch("/api/wishlist/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: wishlistItems }),
        });
        if (wishlistRes.ok) {
          const { items } = await wishlistRes.json();
          setWishlistItems(items);
        }
      } catch (error) {
        console.error("Failed to sync stores:", error);
      } finally {
        hasSyncedInitial.current = true;
      }
    };

    if (!hasSyncedInitial.current) {
      performInitialSync();
    }
  }, [isAuthenticated]); // Only run on mount or auth change

  // Background sync when items change (after initial sync)
  useEffect(() => {
    if (!isAuthenticated || !hasSyncedInitial.current) return;
    
    const debounceCart = setTimeout(() => {
      fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      }).catch(console.error);
    }, 1000);

    return () => clearTimeout(debounceCart);
  }, [cartItems, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !hasSyncedInitial.current) return;
    
    const debounceWishlist = setTimeout(() => {
      fetch("/api/wishlist/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: wishlistItems }),
      }).catch(console.error);
    }, 1000);

    return () => clearTimeout(debounceWishlist);
  }, [wishlistItems, isAuthenticated]);

  return null;
}
