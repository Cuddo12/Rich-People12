import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';

interface WishlistPageProps {
  navigate: (route: string, params?: any) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { success } = useToast();

  const handleMoveAllToBag = () => {
    wishlist.forEach((p) => {
      addItem(p, p.sizes[0] || 'L', p.colors[0], 1);
    });
    clearWishlist();
    success(`Moved ${wishlist.length} items to shopping bag`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-white/[0.08] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-bold">
            Curated Favorites
          </span>
          <h1 className="text-3xl font-bold font-cinzel text-white mt-1">
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleMoveAllToBag}
              className="px-4 py-2 bg-[#831828] hover:bg-[#991b1b] text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
            <button
              onClick={clearWishlist}
              className="px-3 py-2 bg-zinc-900 text-zinc-400 hover:text-white text-xs uppercase tracking-wider rounded border border-white/10"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-cinzel font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-xs text-zinc-400">
            Tap the heart icon on any shirt or panjabi to save it to your private wardrobe.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2.5 bg-[#831828] text-white text-xs uppercase tracking-widest font-bold rounded"
          >
            Explore Garments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};
