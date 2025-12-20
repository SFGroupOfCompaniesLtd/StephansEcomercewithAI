import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

// Types
export interface WishlistItem {
    productId: string;
    name: string;
    price: number;
    image?: string;
    slug: string;
    addedAt: string;
}

export interface WishlistState {
    items: WishlistItem[];
}

export interface WishlistActions {
    addItem: (item: Omit<WishlistItem, "addedAt">) => void;
    removeItem: (productId: string) => void;
    toggleItem: (item: Omit<WishlistItem, "addedAt">) => boolean; // Returns true if added, false if removed
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export type WishlistStore = WishlistState & WishlistActions;

// Default state
export const defaultInitState: WishlistState = {
    items: [],
};

/**
 * Wishlist store factory - creates new store instance per provider
 * Uses persist middleware for localStorage persistence
 */
export const createWishlistStore = (initState: WishlistState = defaultInitState) => {
    return createStore<WishlistStore>()(
        persist(
            (set, get) => ({
                ...initState,

                addItem: (item) =>
                    set((state) => {
                        const existing = state.items.find(
                            (i) => i.productId === item.productId
                        );
                        if (existing) {
                            return state; // Already in wishlist
                        }
                        return {
                            items: [
                                ...state.items,
                                { ...item, addedAt: new Date().toISOString() },
                            ],
                        };
                    }),

                removeItem: (productId) =>
                    set((state) => ({
                        items: state.items.filter((i) => i.productId !== productId),
                    })),

                toggleItem: (item) => {
                    const state = get();
                    const existing = state.items.find(
                        (i) => i.productId === item.productId
                    );
                    if (existing) {
                        set({
                            items: state.items.filter((i) => i.productId !== item.productId),
                        });
                        return false; // Removed
                    } else {
                        set({
                            items: [
                                ...state.items,
                                { ...item, addedAt: new Date().toISOString() },
                            ],
                        });
                        return true; // Added
                    }
                },

                isInWishlist: (productId) => {
                    return get().items.some((i) => i.productId === productId);
                },

                clearWishlist: () => set({ items: [] }),
            }),
            {
                name: "wishlist-storage",
                skipHydration: true,
            }
        )
    );
};
