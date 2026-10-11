import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product, ProductSize } from '../../types/ecommerce';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  navigate: (route: string, params?: any) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  navigate,
  onQuickView,
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'L'
  );
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    if (!showSizePicker && product.sizes && product.sizes.length > 1) {
      setShowSizePicker(true);
      return;
    }

    addItem(product, selectedSize, product.colors[0], 1);
    setIsAddedRecently(true);
    setShowSizePicker(false);
    success(`Added "${product.name}" (${selectedSize}) to bag`);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug || product.id}`, { id: product.id });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#111115] rounded-xl overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        <img
          src={product.featuredImage || product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Dark subtle gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isSale && product.discount && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#e11d48] text-white rounded shadow-md">
              -{product.discount}% OFF
            </span>
          )}
          {product.isNewArrival && !product.isSale && (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/90 text-zinc-950 rounded backdrop-blur-sm">
              New Arrival
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-[#831828] text-white shadow-lg'
              : 'bg-black/40 text-white/80 hover:bg-black/70 hover:text-white'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Quick Add overlay button */}
        <div className="absolute bottom-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 bg-zinc-900/90 text-zinc-500 rounded border border-white/5">
              Sold Out
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`p-2.5 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
                isAddedRecently
                  ? 'bg-emerald-600 text-white scale-105'
                  : 'bg-[#831828] hover:bg-[#991b1b] text-white hover:scale-105'
              }`}
              title="Add to bag"
            >
              {isAddedRecently ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
        {/* Category & Zero-Pill Metadata */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="uppercase tracking-widest font-medium text-amber-200/90">
            {product.category}
          </span>
          {product.fabric && (
            <span className="truncate max-w-[140px] text-zinc-500">
              {product.fabric.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-100 transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {/* Size selector popover if opened */}
        {showSizePicker && !isOutOfStock && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-zinc-900 rounded border border-white/10 text-xs animate-in fade-in"
          >
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
              Select Size:
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    selectedSize === s
                      ? 'bg-white text-zinc-950 font-bold border-white'
                      : 'border-white/20 text-zinc-300 hover:border-white/50'
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={handleAddToCart}
                className="ml-auto px-2 py-0.5 bg-[#831828] text-white text-[11px] font-bold rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Price & Stock Baselines */}
        <div className="pt-1 flex items-baseline justify-between border-t border-white/[0.06]">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-white tabular-nums tracking-wide">
              ৳{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through tabular-nums">
                ৳{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[10px] text-zinc-400">
            {product.stockQuantity > 5 ? (
              <span className="text-emerald-400/90 font-medium">In Stock</span>
            ) : product.stockQuantity > 0 ? (
              <span className="text-amber-400 font-medium">Only {product.stockQuantity} left</span>
            ) : (
              <span className="text-red-400 font-medium">Sold Out</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
