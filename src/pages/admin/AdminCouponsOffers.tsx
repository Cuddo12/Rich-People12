import React, { useState, useEffect } from 'react';
import { Percent, Tag, Plus, Trash2, X, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Coupon, Offer } from '../../types/ecommerce';

export const AdminCouponsOffers: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountAmount, setDiscountAmount] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(1500);
  const [maxDiscount, setMaxDiscount] = useState<number>(500);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [cRes, oRes] = await Promise.all([
        fetch('/api/coupons', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/offers'),
      ]);
      if (cRes.ok) setCoupons(await cRes.json());
      if (oRes.ok) setOffers(await oRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType,
          discountAmount: Number(discountAmount),
          minOrderAmount: Number(minOrder),
          maxDiscountAmount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
          usageLimit: 500,
          perUserLimit: 1,
          startDate: '2026-01-01',
          endDate: '2026-12-31',
          isActive: true,
        }),
      });
      if (res.ok) {
        success('Coupon registered successfully');
        setCouponModalOpen(false);
        setCode('');
        fetchData();
      }
    } catch {
      error('Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Deactivate coupon?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Coupon deleted');
        fetchData();
      }
    } catch {
      error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Promotions & Incentives
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Coupon Codes & Privilege Offers
          </h1>
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coupons List */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel">
              Active Promo Coupons ({coupons.length})
            </h2>
            <button
              onClick={() => setCouponModalOpen(true)}
              className="px-3 py-1.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-semibold rounded uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-300 text-sm tracking-wider">{c.code}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-mono text-zinc-400">
                      {c.discountType === 'percentage' ? `${c.discountAmount}% OFF` : `৳${c.discountAmount} OFF`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Min order: ৳{c.minOrderAmount} · Redeemed: {c.usedCount} times
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(c.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Offers */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel">
              Seasonal Campaigns ({offers.length})
            </h2>
          </div>

          <div className="space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 space-y-1 text-xs">
                <strong className="text-white block font-semibold">{o.name}</strong>
                <p className="text-[11px] text-zinc-400">
                  Type: {o.offerType} · Discount: {o.discountAmount}% · Min spend: ৳{o.minOrderAmount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111116] rounded-xl border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-base font-cinzel font-bold text-white">Create Coupon Code</h3>
              <button onClick={() => setCouponModalOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE15"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Min Order (BDT)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Max Cap (BDT)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCouponModalOpen(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#831828] text-white font-bold rounded">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
