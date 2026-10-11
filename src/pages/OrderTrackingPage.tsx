import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  AlertTriangle,
  RefreshCw,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Order, OrderStatus } from '../types/ecommerce';
import { PrintableInvoice } from '../components/invoice/PrintableInvoice';
import { useToast } from '../context/ToastContext';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  initialPhone?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId = '',
  initialPhone = '',
}) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  // Correction Form State (if rejected or requested new TrxID)
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);
  const [correctTrxId, setCorrectTrxId] = useState('');
  const [correctSenderPhone, setCorrectSenderPhone] = useState('');
  const [correctMethod, setCorrectMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [updatingTrx, setUpdatingTrx] = useState(false);

  const { success, error } = useToast();

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      error('Please provide both Order ID and Phone Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), phone: phone.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        setOrder(data);
        setShowCorrectionForm(data.paymentStatus === 'REJECTED');
      } else {
        setOrder(null);
        error(data.error || 'No matching order found.');
      }
    } catch {
      error('Failed to connect to tracking server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialPhone) {
      handleTrack();
    }
  }, [initialOrderId, initialPhone]);

  const handleUpdateTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!correctTrxId.trim() || !correctSenderPhone.trim()) {
      error('Please provide both new Transaction ID and Sender Number.');
      return;
    }

    setUpdatingTrx(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/update-trx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.customerPhone,
          transactionId: correctTrxId.trim(),
          senderPhone: correctSenderPhone.trim(),
          paymentMethod: correctMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.order) {
        setOrder(data.order);
        setShowCorrectionForm(false);
        success('Transaction details updated! Our team is re-verifying your payment.');
      } else {
        error(data.error || 'Failed to update transaction.');
      }
    } catch {
      error('Network error occurred.');
    } finally {
      setUpdatingTrx(false);
    }
  };

  // Steps pipeline
  const pipelineSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'PAYMENT_UNDER_REVIEW', label: 'Payment Under Review', desc: 'Verifying bKash/Nagad TrxID' },
    { status: 'CONFIRMED', label: 'Order Confirmed', desc: 'Advance verified & allocated' },
    { status: 'PROCESSING', label: 'Crafting & Processing', desc: 'Inspecting seams & interlinings' },
    { status: 'PACKED', label: 'Elegantly Boxed', desc: 'Handcrafted luxury packaging' },
    { status: 'SHIPPED', label: 'Dispatched with Courier', desc: 'In transit to your district' },
    { status: 'DELIVERED', label: 'Delivered', desc: 'Handed over at doorstep' },
  ];

  const getStepState = (stepStatus: OrderStatus): 'done' | 'current' | 'upcoming' => {
    if (!order) return 'upcoming';

    const orderStatusOrder: OrderStatus[] = [
      'PAYMENT_UNDER_REVIEW',
      'CONFIRMED',
      'PROCESSING',
      'PACKED',
      'SHIPPED',
      'DELIVERED',
    ];

    const currentIdx = orderStatusOrder.indexOf(order.orderStatus);
    const stepIdx = orderStatusOrder.indexOf(stepStatus);

    if (order.orderStatus === 'CANCELLED') return 'upcoming';
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-bold">
          Live Shipment Status
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
          Track Your Rich People Garment
        </h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          Enter your Order ID (e.g. RICH-2026-00001) and the contact phone number used during checkout.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleTrack}
        className="p-6 rounded-2xl bg-[#0f0f13] border border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
            Order ID *
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="e.g. RICH-2026-00001"
            className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono uppercase text-xs focus:outline-none focus:border-white/40"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 01711223344"
            className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-white/40"
            required
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 h-[42px]"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Order Status Display */}
      {order && (
        <div className="space-y-8 animate-in fade-in">
          {/* Header Summary */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">{order.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : order.paymentStatus === 'REJECTED'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  Payment: {order.paymentStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-white/10 text-zinc-300">
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Booked on {new Date(order.createdAt).toLocaleDateString()} for{' '}
                <strong className="text-white">{order.customerName}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowInvoice(true)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>View Invoice</span>
            </button>
          </div>

          {/* Payment Rejected Alert & Correction Form */}
          {order.paymentStatus === 'REJECTED' && (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-4">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Payment Verification Rejected</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Our accounts department was unable to verify the transaction ID{' '}
                <strong className="font-mono">{order.transactionId}</strong> on{' '}
                {order.paymentMethod}. Please review and update with your correct Transaction ID below to proceed with order fulfillment.
              </p>

              {showCorrectionForm ? (
                <form onSubmit={handleUpdateTrx} className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-4 text-xs">
                  <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Submit Corrected Transaction Info:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">Method *</label>
                      <select
                        value={correctMethod}
                        onChange={(e) => setCorrectMethod(e.target.value as any)}
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 text-white"
                      >
                        <option value="bKash">bKash Send Money</option>
                        <option value="Nagad">Nagad Send Money</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Correct TrxID *</label>
                      <input
                        type="text"
                        value={correctTrxId}
                        onChange={(e) => setCorrectTrxId(e.target.value.toUpperCase())}
                        placeholder="e.g. 9K28M9X41P"
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 text-white font-mono uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Sender Mobile *</label>
                      <input
                        type="tel"
                        value={correctSenderPhone}
                        onChange={(e) => setCorrectSenderPhone(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full px-3 py-2 rounded bg-zinc-900 border border-white/15 text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCorrectionForm(false)}
                      className="px-4 py-2 bg-zinc-800 text-zinc-400 text-xs rounded uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingTrx}
                      className="px-5 py-2 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{updatingTrx ? 'Submitting...' : 'Re-Submit TrxID'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCorrectionForm(true)}
                  className="px-5 py-2 bg-[#831828] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#991b1b] transition-colors"
                >
                  Correct Transaction Details Now
                </button>
              )}
            </div>
          )}

          {/* Visual Timeline Stepper */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10">
              Shipment Progression Timeline
            </h3>

            <div className="relative border-l-2 border-white/10 ml-4 sm:ml-6 space-y-8 py-2">
              {pipelineSteps.map((step, idx) => {
                const state = getStepState(step.status);
                const matchingHistory = order.statusHistory.find((h) => h.status === step.status);

                return (
                  <div key={idx} className="relative pl-6 sm:pl-8">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all ${
                        state === 'done'
                          ? 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-950/50'
                          : state === 'current'
                          ? 'bg-[#e11d48] border-[#e11d48] ring-4 ring-rose-950/80 animate-pulse'
                          : 'bg-zinc-950 border-zinc-700'
                      }`}
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            state === 'current'
                              ? 'text-white font-bold'
                              : state === 'done'
                              ? 'text-zinc-200'
                              : 'text-zinc-500'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {matchingHistory && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(matchingHistory.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">{step.desc}</p>
                      {matchingHistory?.note && (
                        <p className="text-xs text-amber-200/90 italic bg-zinc-950/60 p-2 rounded border border-white/5 mt-1">
                          "{matchingHistory.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Garments in this order */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10">
              Garments in Parcel ({order.items.length})
            </h3>
            <div className="divide-y divide-white/5">
              {order.items.map((item, i) => (
                <div key={i} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-14 object-cover rounded bg-zinc-950" />
                    <div>
                      <strong className="text-white block">{item.name}</strong>
                      <span className="text-zinc-400">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-white tabular-nums">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center text-xs text-zinc-400 gap-3">
              <div>
                Grand Total: <strong className="text-white">৳{order.grandTotal.toLocaleString()}</strong>
              </div>
              <div>
                Advance Paid: <strong className="text-amber-300">৳{order.advancePaid}</strong>
              </div>
              <div className="text-emerald-400 font-bold">
                Remaining COD: ৳{order.remainingCOD.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoice && order && (
        <PrintableInvoice order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};
