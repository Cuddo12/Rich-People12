import React, { useState, useEffect } from 'react';
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, Clock, MapPin, Copy } from 'lucide-react';
import { Order } from '../types/ecommerce';
import { PrintableInvoice } from '../components/invoice/PrintableInvoice';
import { useToast } from '../context/ToastContext';

interface OrderSuccessPageProps {
  orderId: string;
  navigate: (route: string, params?: any) => void;
  passedOrder?: Order;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  navigate,
  passedOrder,
}) => {
  const [order, setOrder] = useState<Order | null>(passedOrder || null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(!passedOrder);
  const { success } = useToast();

  useEffect(() => {
    if (!order && orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setOrder(data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      success('Order ID copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-2 border-[#831828] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest text-zinc-400">Loading Order Confirmation...</p>
      </div>
    );
  }

  const currentOrder = order || passedOrder;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-emerald-400 font-bold block">
          Order Booking Received
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
          Thank You, {currentOrder?.customerName || 'Gentleman'}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your order has been recorded. Our atelier is now reviewing your <strong>{currentOrder?.paymentMethod}</strong> advance payment transaction.
        </p>

        {/* Order ID banner */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs mt-2">
          <span className="text-zinc-400">Order ID:</span>
          <span className="font-mono font-bold text-white tracking-wider text-sm">
            {currentOrder?.id || orderId}
          </span>
          <button
            onClick={copyOrderId}
            className="text-zinc-400 hover:text-white p-1 transition-colors"
            title="Copy Order ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status & Next Steps Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs">
          <Clock className="w-4 h-4 text-amber-300" />
          <h2 className="uppercase tracking-widest font-bold text-white font-cinzel">
            Current Status: Payment Under Review
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
          <div className="p-4 rounded-lg bg-zinc-950 border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Advance Paid
            </span>
            <span className="text-base font-bold text-amber-300 tabular-nums">
              ৳{currentOrder?.advancePaid || 200}
            </span>
            <p className="text-[11px] text-zinc-400">
              via {currentOrder?.paymentMethod} (TrxID: {currentOrder?.transactionId})
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Remaining COD
            </span>
            <span className="text-base font-bold text-white tabular-nums">
              ৳{currentOrder?.remainingCOD?.toLocaleString() || '0'}
            </span>
            <p className="text-[11px] text-zinc-400">
              Pay upon parcel delivery
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-white/5 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">
              Estimated Delivery
            </span>
            <span className="text-base font-bold text-emerald-400">
              {currentOrder?.deliveryMethod === 'Inside Dhaka' ? '24 - 48 Hours' : '2 - 4 Days'}
            </span>
            <p className="text-[11px] text-zinc-400">
              {currentOrder?.deliveryMethod}
            </p>
          </div>
        </div>

        {/* Verification reassurance */}
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/[0.06] text-xs space-y-2 text-zinc-400">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>How verification works:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Our finance team cross-references your Transaction ID <strong>{currentOrder?.transactionId}</strong> with our bKash/Nagad statements. Once verified, your order status switches to <strong>CONFIRMED</strong> and goes straight into precision packing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() =>
              navigate('/track', {
                orderId: currentOrder?.id || orderId,
                phone: currentOrder?.customerPhone || '',
              })
            }
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#831828] to-[#e11d48] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.18em] rounded transition-all shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {currentOrder && (
            <button
              onClick={() => setShowInvoice(true)}
              className="py-3.5 px-6 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && currentOrder && (
        <PrintableInvoice
          order={currentOrder}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};
