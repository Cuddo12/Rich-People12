import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Upload,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SiteSettings } from '../types/ecommerce';

interface CheckoutPageProps {
  navigate: (route: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { items, subtotal, appliedCoupon, couponDiscount, clearCart } = useCart();
  const { error, success } = useToast();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Customer Shipping Information
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Delivery Method Selection
  const [deliveryMethod, setDeliveryMethod] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');

  // Manual Advance Payment details
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error(err));
  }, []);

  // Update delivery method automatically based on division
  useEffect(() => {
    if (division === 'Dhaka' && district.toLowerCase() === 'dhaka') {
      setDeliveryMethod('Inside Dhaka');
    } else {
      setDeliveryMethod('Outside Dhaka');
    }
  }, [division, district]);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-cinzel font-bold text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-zinc-400">Please select garments to proceed to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#831828] text-white text-xs uppercase tracking-widest font-semibold rounded"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  // Cost calculations
  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const isFreeShipping = subtotal >= freeThreshold;
  const shippingCharge = isFreeShipping
    ? 0
    : deliveryMethod === 'Inside Dhaka'
    ? settings?.shippingChargeInsideDhaka || 80
    : settings?.shippingChargeOutsideDhaka || 150;

  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);
  const advanceAmount = settings?.advancePaymentAmount || 200;
  const remainingCOD = Math.max(0, grandTotal - advanceAmount);

  const activeSendMoneyNumber =
    paymentMethod === 'bKash'
      ? settings?.bkashNumber || '01712-345678'
      : settings?.nagadNumber || '01812-345678';

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('Screenshot image size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customerName.trim() || !customerPhone.trim() || !fullAddress.trim() || !area.trim()) {
      error('Please complete all required shipping fields.');
      return;
    }

    if (!transactionId.trim() || !senderPhone.trim()) {
      error('Please input your payment Transaction ID and Sender Mobile Number.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || `${customerPhone.trim()}@customer.richpeople.fashion`,
        shippingAddress: {
          customerName: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
          division,
          district,
          area: area.trim(),
          fullAddress: fullAddress.trim(),
          postCode: postCode.trim(),
          notes: deliveryNotes.trim(),
        },
        deliveryMethod,
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        couponCode: appliedCoupon?.code,
        paymentMethod,
        transactionId: transactionId.trim().toUpperCase(),
        senderPhone: senderPhone.trim(),
        paymentScreenshot: screenshotPreview || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        clearCart();
        success(`Order #${data.order.id} placed successfully!`);
        navigate(`/order-success/${data.order.id}`, { order: data.order });
      } else {
        error(data.error || 'Failed to submit order. Please check inputs.');
      }
    } catch (err) {
      error('Network error occurred while submitting order.');
    } finally {
      setLoading(false);
    }
  };

  const divisions = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-semibold">
            Secure Booking
          </span>
          <h1 className="text-3xl font-bold font-cinzel text-white mt-1">
            Express Checkout
          </h1>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Bag</span>
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shipping & Payment verification form (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* SECTION A: Shipping Address */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Truck className="w-5 h-5 text-amber-200" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-white font-cinzel">
                1. Delivery & Recipient Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Mobile Contact Number *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">
                  Email Address (Optional, for tracking invoices)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. tanvir@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Division *
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none"
                >
                  {divisions.map((d) => (
                    <option key={d} value={d} className="bg-zinc-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  District / City *
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Dhaka or Chittagong"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Area / Thana *
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Banani, Gulshan, Uttara, Nasirabad"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  placeholder="e.g. 1213"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">
                  Full Street Address & Landmark *
                </label>
                <textarea
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House number, Flat number, Road/Block, Landmark..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-semibold mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Call 15 mins before arriving, Leave with building reception"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery Method Options */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <label className="text-xs uppercase tracking-wider text-zinc-300 font-semibold block">
                Delivery Coverage
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div
                  onClick={() => setDeliveryMethod('Inside Dhaka')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    deliveryMethod === 'Inside Dhaka'
                      ? 'bg-[#831828]/20 border-[#831828] text-white'
                      : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span>Inside Dhaka</span>
                    <span className="tabular-nums">
                      {isFreeShipping ? 'FREE' : `৳${settings?.shippingChargeInsideDhaka || 80}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">24 to 48 Hours Delivery</p>
                </div>

                <div
                  onClick={() => setDeliveryMethod('Outside Dhaka')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    deliveryMethod === 'Outside Dhaka'
                      ? 'bg-[#831828]/20 border-[#831828] text-white'
                      : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span>Outside Dhaka</span>
                    <span className="tabular-nums">
                      {isFreeShipping ? 'FREE' : `৳${settings?.shippingChargeOutsideDhaka || 150}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">2 to 4 Days Nationwide Courier</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: Manual Advance Payment Verification Workflow */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm uppercase tracking-widest font-bold text-white font-cinzel">
                2. Manual Advance Payment (bKash / Nagad)
              </h2>
            </div>

            {/* Instruction Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#4a0e17]/80 to-[#1f070c] border border-rose-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-200 font-bold uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-rose-400" />
                <span>Send ৳{advanceAmount} via "Send Money" (Personal)</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                To verify your genuine order booking and avoid courier return charges, please send <strong>৳{advanceAmount}</strong> via Send Money. The remaining <strong>৳{remainingCOD.toLocaleString()}</strong> will be collected via Cash on Delivery (COD) at your doorstep.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'bKash'
                    ? 'bg-[#d82260]/15 border-[#d82260] text-white shadow-lg shadow-[#d82260]/10'
                    : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <span className="font-bold text-sm tracking-wide text-rose-300">bKash Send Money</span>
                <span className="text-[10px] text-zinc-400">Personal Account</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'bg-[#f7941d]/15 border-[#f7941d] text-white shadow-lg shadow-[#f7941d]/10'
                    : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <span className="font-bold text-sm tracking-wide text-amber-300">Nagad Send Money</span>
                <span className="text-[10px] text-zinc-400">Personal Account</span>
              </button>
            </div>

            {/* Merchant / Receiver Number Callout */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                  {paymentMethod} Send Money Number
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-white tracking-widest select-all">
                  {activeSendMoneyNumber}
                </span>
              </div>
              <span className="px-3 py-1 bg-zinc-900 border border-white/10 rounded text-[11px] font-mono text-zinc-300">
                Send ৳{advanceAmount}
              </span>
            </div>

            {/* Transaction Verification Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. 9K28M9X41P"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono tracking-wider focus:outline-none focus:border-white/40"
                  required
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Found in SMS confirmation after sending money
                </span>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Sender Mobile Number *
                </label>
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono focus:outline-none focus:border-white/40"
                  required
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  The account number you sent money from
                </span>
              </div>

              {/* Optional Screenshot */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="block text-zinc-300 font-semibold">
                  Payment Screenshot (Optional, accelerates verification)
                </label>
                <label className="flex items-center gap-3 p-3 rounded bg-zinc-950 border border-dashed border-white/20 cursor-pointer hover:border-white/40 transition-colors">
                  <Upload className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11px] text-zinc-400">
                    {screenshotPreview ? 'Screenshot attached (Click to change)' : 'Upload bKash/Nagad receipt screenshot (Max 5MB)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </label>
                {screenshotPreview && (
                  <div className="w-24 h-24 rounded border border-white/20 overflow-hidden mt-2 relative">
                    <img src={screenshotPreview} alt="Screenshot" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview('')}
                      className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-0.5 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Calculation & Booking CTA (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-6 lg:sticky lg:top-28">
            <h2 className="text-base font-cinzel font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Order Breakdown
            </h2>

            {/* Items review snippet */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-14 object-cover rounded bg-zinc-950 border border-white/5"
                    />
                    <div>
                      <h4 className="font-semibold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-white tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Table */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Product Subtotal</span>
                <span className="font-semibold text-white tabular-nums">৳{subtotal.toLocaleString()}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold tabular-nums">-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-300">
                <span>Delivery Charge ({deliveryMethod})</span>
                <span className="font-semibold text-white tabular-nums">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    `৳${shippingCharge}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                <span>Order Total Value</span>
                <span className="tabular-nums">৳{grandTotal.toLocaleString()}</span>
              </div>

              {/* Exact user-requested advance calculation display */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.08] space-y-2 text-xs mt-3">
                <div className="flex justify-between text-amber-300 font-bold">
                  <span>Advance Payment (Now via {paymentMethod}):</span>
                  <span>৳{advanceAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-white/5">
                  <span>Remaining Cash on Delivery (COD):</span>
                  <span>৳{remainingCOD.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-zinc-500 pt-1">
                  *Delivery fee is not charged twice. Your ৳{advanceAmount} advance is fully deducted from total.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#831828] via-[#a11c30] to-[#831828] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.2em] rounded transition-all shadow-xl shadow-rose-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Submitting Order...' : 'Confirm Order & Submit Payment'}</span>
            </button>

            <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
              By confirming, your order will be placed as <span className="text-zinc-300">Payment Under Review</span>. Our atelier will verify your TrxID before dispatching.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
