import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product, ProductSize } from '../../types/ecommerce';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  navigate: (route: string, params?: any) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  navigate,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const [selectedImage, setSelectedImage] = useState(
    product.featuredImage || product.images[0]
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'L'
  );
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, product.colors[0], quantity);
    success(`Added ${quantity}x "${product.name}" (${selectedSize}) to bag`);
    onClose();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, product.colors[0], quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-[#111116] rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="p-6 bg-zinc-950/60 flex flex-col justify-between">
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-900 border border-white/5 relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.isSale && product.discount && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-[#e11d48] text-white rounded">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 rounded border overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#831828] ring-1 ring-[#831828]'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-widest text-amber-200 font-semibold font-cinzel">
                {product.category}
              </span>
              <span className="font-mono text-zinc-500">SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white leading-tight">
              {product.name}
            </h2>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-white tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-zinc-500 line-through tabular-nums">
                  ৳{product.compareAtPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Save ৳{((product.compareAtPrice || 0) - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Fabric & Fit specs */}
            <div className="p-3 bg-zinc-900/60 rounded border border-white/[0.06] text-xs space-y-1 text-zinc-300">
              {product.fabric && (
                <div><strong className="text-white">Fabric:</strong> {product.fabric}</div>
              )}
              {product.fit && (
                <div><strong className="text-white">Fit:</strong> {product.fit}</div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {product.shortDescription || product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-semibold uppercase tracking-wider">
                  Select Size
                </span>
                <span className="text-zinc-500">Selected: {selectedSize}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded border transition-all ${
                      selectedSize === s
                        ? 'bg-white text-zinc-950 border-white font-bold'
                        : 'border-white/20 text-zinc-300 hover:border-white/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center border border-white/20 rounded bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-zinc-300 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs text-white font-bold min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-3 py-1 text-zinc-300 hover:text-white"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-zinc-500">
                ({product.stockQuantity} pieces available)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-white/[0.08]">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3 px-4 bg-gradient-to-r from-[#831828] to-[#e11d48] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
              >
                <span>Buy Now</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <button
                onClick={() => toggleWishlist(product)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-[#831828]' : ''}`} />
                <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.slug || product.id}`, { id: product.id });
                }}
                className="underline hover:text-white transition-colors"
              >
                View Full Specifications →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
