import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface CartDrawerProps {
  navigate: (route: string, params?: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateQuantity,
    subtotal,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const { success, error } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    const res = await applyCouponCode(couponInput.trim());
    setIsApplying(false);
    if (res.success) {
      success(res.message);
      setCouponInput('');
    } else {
      error(res.message);
    }
  };

  const freeShippingThreshold = 5000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f0f13] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-white font-cinzel">
                Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="text-zinc-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-5 py-3 bg-zinc-950/80 border-b border-white/[0.06]">
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-semibold tracking-wide">
                  🎉 Congratulations! You have unlocked FREE Shipping
                </span>
              ) : (
                <span className="text-zinc-400">
                  Add <strong className="text-white">৳{amountNeededForFreeShipping}</strong> more for Free Shipping
                </span>
              )}
              <span className="text-zinc-500 tabular-nums">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#831828] to-[#e11d48] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-cinzel font-bold text-white mb-1">Your Bag is Empty</h3>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Explore our handcrafted collection of premium Shirts and Panjabis.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg bg-zinc-900/40 border border-white/[0.06] hover:border-white/10 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded bg-zinc-950 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata: zero-pill format */}
                      <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
                        <span>Size: <strong className="text-zinc-200">{item.size}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[110px]">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10 rounded bg-zinc-950">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-zinc-400 hover:text-white text-xs transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-xs text-white font-medium tabular-nums min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2 py-1 text-zinc-400 hover:text-white disabled:text-zinc-600 text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-white tabular-nums">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.compareAtPrice && (
                          <span className="block text-[10px] text-zinc-500 line-through tabular-nums">
                            ৳{(item.compareAtPrice * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/[0.08] bg-[#0c0c10] space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#831828]/20 border border-[#831828]/40 p-2.5 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="font-semibold text-rose-200">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-zinc-400 ml-1.5 font-mono">
                        (-৳{couponDiscount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] text-zinc-400 hover:text-red-400 underline uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. RICHPEOPLE, RICH500)"
                      className="flex-1 px-3 py-2 text-xs rounded bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-zinc-400">
                    <span className="text-zinc-500">VIP Perks:</span>
                    <button
                      type="button"
                      onClick={() => setCouponInput('RICHPEOPLE')}
                      className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono hover:bg-amber-500/20"
                    >
                      RICHPEOPLE (15% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponInput('RICH500')}
                      className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 text-zinc-300 font-mono hover:bg-zinc-700"
                    >
                      RICH500 (৳500 OFF)
                    </button>
                  </div>
                </div>
              )}

              {/* Subtotal summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium tabular-nums">৳{subtotal.toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Privilege Discount</span>
                    <span className="font-medium tabular-nums">-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>Advance Payment (at checkout)</span>
                  <span className="text-amber-300 font-semibold tabular-nums">৳200 (bKash/Nagad)</span>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded bg-zinc-950 border border-white/[0.06] text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pay ৳200 advance to confirm booking. Rest on delivery.</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/checkout');
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#831828] via-[#a11c30] to-[#831828] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.15em] rounded transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
