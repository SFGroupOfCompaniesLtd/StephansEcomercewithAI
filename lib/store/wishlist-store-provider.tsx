"use client";

import {
    createContext,
    useContext,
    useRef,
    useEffect,
    type ReactNode,
} from "react";
import { useStore } from "zustand";
import {
    createWishlistStore,
    type WishlistStore,
    type WishlistState,
    defaultInitState,
} from "./wishlist-store";

// Store API type
export type WishlistStoreApi = ReturnType<typeof createWishlistStore>;

// Context
const WishlistStoreContext = createContext<WishlistStoreApi | undefined>(undefined);

// Provider props
interface WishlistStoreProviderProps {
    children: ReactNode;
    initialState?: WishlistState;
}

/**
 * Wishlist store provider - creates one store instance per provider
 * Manually triggers rehydration from localStorage on the client
 */
export const WishlistStoreProvider = ({
    children,
    initialState,
}: WishlistStoreProviderProps) => {
    const storeRef = useRef<WishlistStoreApi | null>(null);

    if (storeRef.current === null) {
        storeRef.current = createWishlistStore(initialState ?? defaultInitState);
    }

    // Manually trigger rehydration on the client after mount
    useEffect(() => {
        storeRef.current?.persist.rehydrate();
    }, []);

    return (
        <WishlistStoreContext.Provider value={storeRef.current}>
            {children}
        </WishlistStoreContext.Provider>
    );
};

/**
 * Hook to access the wishlist store with a selector
 */
export const useWishlistStore = <T,>(selector: (store: WishlistStore) => T): T => {
    const wishlistStoreContext = useContext(WishlistStoreContext);

    if (!wishlistStoreContext) {
        throw new Error("useWishlistStore must be used within WishlistStoreProvider");
    }

    return useStore(wishlistStoreContext, selector);
};

// ============================================
// Convenience Hooks
// ============================================

/**
 * Get all wishlist items
 */
export const useWishlistItems = () => useWishlistStore((state) => state.items);

/**
 * Get total number of items in wishlist
 */
export const useWishlistCount = () =>
    useWishlistStore((state) => state.items.length);

/**
 * Check if a product is in the wishlist
 */
export const useIsInWishlist = (productId: string) =>
    useWishlistStore((state) =>
        state.items.some((item) => item.productId === productId)
    );

/**
 * Get all wishlist actions
 */
export const useWishlistActions = () => {
    const addItem = useWishlistStore((state) => state.addItem);
    const removeItem = useWishlistStore((state) => state.removeItem);
    const toggleItem = useWishlistStore((state) => state.toggleItem);
    const clearWishlist = useWishlistStore((state) => state.clearWishlist);

    return {
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
    };
};
