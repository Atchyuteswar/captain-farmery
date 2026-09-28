import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state; // already in wishlist
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      toggleItem: (item) => {
        const isIn = get().isInWishlist(item.productId);
        if (isIn) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },
    }),
    {
      name: "captain-farmery-wishlist",
    }
  )
);
