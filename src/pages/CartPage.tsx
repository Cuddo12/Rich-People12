import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface CartPageProps {
  navigate: (route: string, params?: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    items,
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

  const advanceAmount = 200;
  const estimatedShipping = subtotal >= 5000 ? 0 : 80;
  const grandTotal = Math.max(0, subtotal - couponDiscount + estimatedShipping);
  const remainingCod = Math.max(0, grandTotal - advanceAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-cinzel font-bold text-white">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Explore our handcrafted collection of premium Shirts and Panjabis crafted in Bangladesh.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs uppercase tracking-widest font-bold rounded transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-white/[0.08] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-semibold">
            Order Review
          </span>
          <h1 className="text-3xl font-bold font-cinzel text-white mt-1">
            Your Shopping Bag ({items.length})
          </h1>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl bg-[#111116] border border-white/[0.07] items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg bg-zinc-950 shrink-0 border border-white/5"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <span>Size: <strong className="text-white">{item.size}</strong></span>
                    <span>·</span>
                    <span>{item.color}</span>
                  </div>
                  <div className="text-xs font-bold text-white pt-1">
                    ৳{item.price.toLocaleString()} each
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center border border-white/10 rounded bg-zinc-950">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2.5 py-1 text-zinc-400 hover:text-white text-xs"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 text-xs text-white font-bold min-w-[24px] text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="px-2.5 py-1 text-zinc-400 hover:text-white text-xs disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="text-sm font-bold text-white tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f0f13] p-6 sm:p-8 rounded-2xl border border-white/[0.08] space-y-6 h-fit">
          <h2 className="text-base font-cinzel font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
            Order Calculation
          </h2>

          {/* Coupon Code Section */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-[#831828]/20 border border-[#831828]/40 p-3 rounded text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="font-bold text-rose-200">{appliedCoupon.code}</span>
                    <span className="text-zinc-400 ml-1.5">
                      (-৳{couponDiscount.toLocaleString()})
                    </span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-[11px] text-zinc-400 hover:text-red-400 underline uppercase"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. RICHPEOPLE, RICH500)"
                    className="flex-1 px-3.5 py-2.5 text-xs rounded bg-zinc-950 border border-white/10 text-white uppercase tracking-wider focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider rounded"
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
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-2 text-xs border-t border-white/[0.06] pt-4">
            <div className="flex justify-between text-zinc-300">
              <span>Bag Subtotal</span>
              <span className="font-semibold text-white tabular-nums">৳{subtotal.toLocaleString()}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>Coupon Privilege Discount</span>
                <span className="font-semibold tabular-nums">-৳{couponDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-300">
              <span>Estimated Delivery Charge</span>
              <span className="tabular-nums">
                {estimatedShipping === 0 ? (
                  <span className="text-emerald-400 font-bold">FREE (Above ৳5,000)</span>
                ) : (
                  '৳80 (Inside Dhaka) / ৳150 (Outside)'
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white">
              <span>Estimated Order Total</span>
              <span className="tabular-nums">৳{grandTotal.toLocaleString()}</span>
            </div>

            {/* Advance payment and remaining COD */}
            <div className="p-3.5 mt-3 rounded bg-zinc-950 border border-white/[0.08] space-y-1.5 text-xs">
              <div className="flex justify-between text-amber-300 font-semibold">
                <span>Required Advance (bKash/Nagad):</span>
                <span>৳{advanceAmount}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Remaining Cash on Delivery (COD):</span>
                <span className="text-white font-bold">৳{remainingCod.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-gradient-to-r from-[#831828] via-[#a11c30] to-[#831828] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.2em] rounded transition-all shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
