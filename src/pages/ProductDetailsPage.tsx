import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Table,
  ArrowLeft,
  X,
  Crown
} from 'lucide-react';
import { Product, ProductSize, Review } from '../types/ecommerce';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailsPageProps {
  slugOrId: string;
  navigate: (route: string, params?: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  slugOrId,
  navigate,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<ProductSize>('L');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Accordion open states
  const [openSection, setOpenSection] = useState<'fabric' | 'sizing' | 'care' | 'delivery'>('fabric');

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slugOrId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelated(data.related || []);
          setActiveImage(data.product.featuredImage || data.product.images[0]);
          if (data.product.sizes?.length) setSelectedSize(data.product.sizes[0]);
          if (data.product.colors?.length) setSelectedColor(data.product.colors[0]);

          // Fetch reviews
          const revRes = await fetch(`/api/reviews?productId=${data.product.id}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            setReviews(revData);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#831828] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest text-zinc-400">Loading Garment Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-cinzel font-bold text-white">Garment Not Found</h2>
        <p className="text-xs text-zinc-400">The product you requested might have been discontinued or moved.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#831828] text-white text-xs uppercase tracking-widest font-semibold rounded"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor, quantity);
    success(`Added ${quantity}x "${product.name}" (${selectedSize}) to bag`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) {
      error('Please provide your name and review comments.');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewerName,
          rating: reviewRating,
          title: reviewTitle || 'Customer Review',
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        success('Review submitted for moderation! Thank you.');
        setReviewModalOpen(false);
        setReviewerName('');
        setReviewTitle('');
        setReviewComment('');
      } else {
        error('Failed to submit review.');
      }
    } catch {
      error('Network error.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Back button */}
      <button
        onClick={() => navigate('/shop')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Collection</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 relative shadow-2xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.isSale && product.discount && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#e11d48] text-white rounded shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-28 rounded-lg border overflow-hidden shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-[#831828] ring-2 ring-[#831828]/50'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0f0f13] p-6 sm:p-8 rounded-2xl border border-white/[0.08] space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="uppercase tracking-widest text-amber-200 font-semibold font-cinzel">
                {product.category}
              </span>
              <span className="font-mono text-zinc-500 text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Price baselines */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white tabular-nums tracking-wide">
                ৳{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-zinc-500 line-through tabular-nums">
                  ৳{product.compareAtPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Save ৳{((product.compareAtPrice || 0) - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Short review summary */}
            <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span>({reviews.length} Verified Reviews)</span>
            </div>
          </div>

          {/* Sizing Selector with Size Chart trigger */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">
                Select Size: <strong className="text-white ml-1">{selectedSize}</strong>
              </span>
              <button
                onClick={() => setSizeChartOpen(true)}
                className="text-amber-200 hover:text-white flex items-center gap-1 underline text-[11px] uppercase tracking-wider"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Size Chart</span>
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-10 rounded text-xs font-semibold border transition-all flex items-center justify-center ${
                    selectedSize === s
                      ? 'bg-white text-zinc-950 border-white shadow-lg'
                      : 'border-white/20 text-zinc-300 hover:border-white/50 bg-zinc-900/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Display */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <span className="text-zinc-300 font-semibold uppercase tracking-wider">
                Shade / Tone
              </span>
              <div className="text-xs text-zinc-300 font-medium">
                {product.colors[0]}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-xs text-zinc-300 font-semibold uppercase tracking-wider">
              Quantity
            </span>
            <div className="flex items-center border border-white/20 rounded bg-zinc-950">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-zinc-300 hover:text-white"
              >
                -
              </button>
              <span className="px-3 py-1.5 text-xs text-white font-bold min-w-[32px] text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3 py-1.5 text-zinc-300 hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Alert */}
          <div className="text-[11px]">
            {product.stockQuantity > 5 ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> In Stock & Ready for Dispatch
              </span>
            ) : product.stockQuantity > 0 ? (
              <span className="text-amber-400 font-medium">
                Limited Stock: Only {product.stockQuantity} items remaining in atelier
              </span>
            ) : (
              <span className="text-red-400 font-bold uppercase tracking-wider">
                Out of Stock (Batch Sold Out)
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.15em] rounded transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#831828] via-[#a11c30] to-[#831828] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.18em] rounded transition-all duration-200 shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2"
            >
              <span>Instant Buy Now</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="w-full py-2.5 text-center text-xs text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 border border-white/10 rounded"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-[#831828]' : ''}`} />
              <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Advance payment reassurance */}
          <div className="p-3.5 rounded bg-zinc-950/80 border border-white/[0.06] text-xs space-y-1.5 text-zinc-400">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>৳200 Advance Delivery Verification</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              To prevent fraudulent bookings, pay ৳200 advance charge via bKash or Nagad Send Money. Balance is settled at your doorstep upon delivery.
            </p>
          </div>

          {/* Rich People VIP Privilege Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-950/20 to-amber-500/10 border border-amber-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-amber-200">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Rich People VIP Privilege</span>
              </div>
              <span className="font-mono text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-black/60 border border-amber-500/30">
                15% OFF: RICHPEOPLE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Club members enjoy complimentary bespoke initials monogramming on French cuffs and priority Dhaka courier dispatch.
            </p>
          </div>

          {/* Accordions */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
            {/* Fabric & Fit */}
            <div className="border border-white/10 rounded overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'fabric' ? ('' as any) : 'fabric')}
                className="w-full p-3 bg-zinc-950/50 flex justify-between items-center text-zinc-200 font-semibold uppercase tracking-wider"
              >
                <span>Fabric & Silhouette</span>
                {openSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'fabric' && (
                <div className="p-3 bg-zinc-900/30 text-zinc-400 space-y-2 leading-relaxed">
                  <p><strong className="text-zinc-200">Fabric Composition:</strong> {product.fabric}</p>
                  <p><strong className="text-zinc-200">Fit Profile:</strong> {product.fit}</p>
                  <p><strong className="text-zinc-200">Fabric Weight:</strong> {product.weight || '165-185 GSM Medium-Dense'}</p>
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Care instructions */}
            <div className="border border-white/10 rounded overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'care' ? ('' as any) : 'care')}
                className="w-full p-3 bg-zinc-950/50 flex justify-between items-center text-zinc-200 font-semibold uppercase tracking-wider"
              >
                <span>Care & Maintenance</span>
                {openSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'care' && (
                <div className="p-3 bg-zinc-900/30 text-zinc-400 space-y-1.5 leading-relaxed text-[11px]">
                  <p>• Dry clean recommended for silk-blend Panjabis</p>
                  <p>• Machine wash cold on gentle cycle inside out for cotton shirts</p>
                  <p>• Use mild detergent; do not use chlorine bleach</p>
                  <p>• Warm iron inside-out while damp for crisp collar finish</p>
                </div>
              )}
            </div>

            {/* Delivery & Exchange */}
            <div className="border border-white/10 rounded overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === 'delivery' ? ('' as any) : 'delivery')}
                className="w-full p-3 bg-zinc-950/50 flex justify-between items-center text-zinc-200 font-semibold uppercase tracking-wider"
              >
                <span>Delivery & 7-Day Exchange</span>
                {openSection === 'delivery' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'delivery' && (
                <div className="p-3 bg-zinc-900/30 text-zinc-400 space-y-1.5 leading-relaxed text-[11px]">
                  <p>• <strong>Dhaka City:</strong> 24 to 48 hours delivery (৳80 fee)</p>
                  <p>• <strong>Outside Dhaka:</strong> 2 to 4 business days via courier (৳150 fee)</p>
                  <p>• <strong>Free Shipping:</strong> Automatically applied on orders over ৳5,000</p>
                  <p>• <strong>Hassle-Free Exchange:</strong> 7-day sizing exchange warranty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-white/10 pt-16 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#e11d48] font-bold">
              Client Appraisals
            </span>
            <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
              Garment Reviews ({reviews.length})
            </h2>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs uppercase tracking-wider font-semibold rounded border border-white/10 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 rounded-xl bg-zinc-950/50 border border-white/5 text-center text-zinc-400 text-xs">
            Be the first gentleman to share an appraisal for this handcrafted piece.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{rev.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed italic">"{rev.comment}"</p>
                <div className="text-[11px] text-zinc-400 font-medium">
                  — {rev.customerName} (Verified Purchase)
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="border-t border-white/10 pt-16 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-amber-200 font-semibold">
              Complementary Pieces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
              You May Also Appreciate
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSizeChartOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#111116] rounded-xl border border-white/10 p-6 space-y-4 z-10 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-cinzel font-bold text-white">
                Rich People Standard Measurement Chart (Inches)
              </h3>
              <button onClick={() => setSizeChartOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900 text-zinc-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Shoulder</th>
                    <th className="p-2.5">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">S (38)</td>
                    <td className="p-2.5">38"</td>
                    <td className="p-2.5">28.5" / 40"</td>
                    <td className="p-2.5">17.5"</td>
                    <td className="p-2.5">24.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">M (40)</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">29.5" / 42"</td>
                    <td className="p-2.5">18.5"</td>
                    <td className="p-2.5">25.0"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">L (42)</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">30.5" / 44"</td>
                    <td className="p-2.5">19.5"</td>
                    <td className="p-2.5">25.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">XL (44)</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">31.5" / 46"</td>
                    <td className="p-2.5">20.5"</td>
                    <td className="p-2.5">26.0"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">XXL (46)</td>
                    <td className="p-2.5">46"</td>
                    <td className="p-2.5">32.5" / 48"</td>
                    <td className="p-2.5">21.5"</td>
                    <td className="p-2.5">26.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              *Length shows (Shirt length / Panjabi length). All measurements are in inches with +/- 0.5 inch allowance.
            </p>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#111116] rounded-xl border border-white/10 p-6 space-y-4 z-10 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-cinzel font-bold text-white">
                Write a Client Appraisal
              </h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Your Name *</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Asif Karim"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/10 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-zinc-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Impeccable tailoring and finish"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-semibold">Comments & Feedback *</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the fabric feel, collar fit, or event experience..."
                  rows={4}
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/10 text-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 bg-[#831828] hover:bg-[#991b1b] text-white font-bold uppercase tracking-widest rounded transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Submit Appraisal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
