"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { StockBadge } from "@/components/app/StockBadge";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface Product {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  stock: number | null;
  images: Array<{
    _key: string;
    asset: {
      url: string | null;
    } | null;
  }> | null;
  category: {
    title: string | null;
  } | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null,
  );
  const { addItem } = useCartActions();

  const images = product.images ?? [];
  const mainImageUrl = images[0]?.asset?.url;
  const displayedImageUrl =
    hoveredImageIndex !== null
      ? images[hoveredImageIndex]?.asset?.url
      : mainImageUrl;

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const hasMultipleImages = images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isOutOfStock) return;

    addItem({
      productId: product._id,
      name: product.name ?? "Product",
      price: product.price ?? 0,
      image: mainImageUrl ?? undefined,
    });
    toast.success("Added to cart");
  };

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white dark:bg-zinc-900/50 dark:border-zinc-800/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div
          className={cn(
            "relative overflow-hidden bg-zinc-100 dark:bg-zinc-800",
            hasMultipleImages ? "aspect-square" : "aspect-[4/5]",
          )}
        >
          {displayedImageUrl ? (
            <Image
              src={displayedImageUrl}
              alt={product.name ?? "Product image"}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              <span className="text-xs font-mono uppercase tracking-widest">No Image</span>
            </div>
          )}

          {/* Tech Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Quick Buy Overlay */}
          <div className="absolute inset-x-0 bottom-4 px-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="w-full h-11 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white rounded-xl font-medium shadow-lg hover:bg-white dark:hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">Quick Add</span>
            </button>
          </div>

          {/* Badges - Tech Style */}
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] uppercase tracking-widest font-bold shadow-sm backdrop-blur-md"
            >
              Out of Stock
            </Badge>
          )}
          {product.category && (
            <span className="absolute left-3 top-3 rounded-md bg-white/80 dark:bg-zinc-950/80 px-2.5 py-1 text-[10px] font-mono tracking-wider font-medium text-zinc-700 dark:text-zinc-300 shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/10 uppercase">
              {product.category.title}
            </span>
          )}
        </div>
      </Link>

      {/* Thumbnail strip */}
      {hasMultipleImages && (
        <div className="flex gap-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-2">
          {images.map((image, index) => (
            <button
              key={image._key ?? index}
              type="button"
              className={cn(
                "relative h-12 w-12 overflow-hidden rounded-md transition-all duration-200 border",
                hoveredImageIndex === index
                  ? "border-zinc-900 dark:border-white ring-1 ring-zinc-900/10"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              onMouseEnter={() => setHoveredImageIndex(index)}
              onMouseLeave={() => setHoveredImageIndex(null)}
            >
              {image.asset?.url && (
                <Image
                  src={image.asset.url}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <CardContent className="flex grow flex-col justify-between gap-3 p-5">
        <Link href={`/products/${product.slug}`} className="block group/title">
          <h3 className="line-clamp-2 text-base font-medium leading-tight text-zinc-800 dark:text-zinc-200 transition-colors group-hover/title:text-amber-600 dark:group-hover/title:text-amber-400">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3 mt-1">
          <p className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-mono">
            {formatPrice(product.price)}
          </p>
          <StockBadge productId={product._id} stock={stock} />
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-5 pt-0 hidden mobile:block">
        {/* Hidden on desktop since we have Quick Add Overlay, but could keep for semantic structure or fallback? 
            Actually, let's keep it but maybe hide it if we want purely quick-add on interaction? 
            The requirement says "ProductCard will receive a Quick-Buy overlay". 
            Usually this replaces the static button or stays alongside. 
            I'll keep the static AddToCartButton visible as a fallback and for standard UX, 
            but the overlay provides the "Enhanced Interaction".
        */}
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Unknown Product"}
          price={product.price ?? 0}
          image={mainImageUrl ?? undefined}
          stock={stock}
          className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0"
        />
      </CardFooter>
    </Card>
  );
}
