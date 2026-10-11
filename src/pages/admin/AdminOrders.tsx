import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Eye,
  AlertTriangle,
  RotateCcw,
  FileText,
  Send,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, OrderStatus, PaymentStatus } from '../../types/ecommerce';
import { PrintableInvoice } from '../../components/invoice/PrintableInvoice';

export const AdminOrders: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [newNote, setNewNote] = useState('');

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search.trim()) q.set('search', search.trim());
      if (statusFilter !== 'ALL') q.set('status', statusFilter);
      if (paymentFilter !== 'ALL') q.set('paymentStatus', paymentFilter);

      const res = await fetch(`/api/orders?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handlePaymentAction = async (action: 'APPROVE' | 'REJECT' | 'REQUEST_NEW_TRX', note?: string) => {
    if (!selectedOrder || !token) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, adminNote: note || `Admin performed ${action}` }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        success(`Payment ${action.toLowerCase()} recorded for #${selectedOrder.id}`);
        fetchOrders();
      } else {
        error('Failed to update payment');
      }
    } catch {
      error('Network error');
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus, note?: string) => {
    if (!selectedOrder || !token) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        success(`Order status changed to ${newStatus}`);
        fetchOrders();
      } else {
        error('Failed to update status');
      }
    } catch {
      error('Network error');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !token || !newNote.trim()) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: newNote.trim() }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        setNewNote('');
        success('Internal note added');
      }
    } catch {
      error('Failed to add note');
    }
  };

  const statuses: OrderStatus[] = [
    'PAYMENT_UNDER_REVIEW',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Fulfillment & Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Order & Payment Management
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('ALL');
              setPaymentFilter('ALL');
              fetchOrders();
            }}
            className="px-3 py-2 rounded bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 rounded-xl bg-[#0e0e12] border border-white/[0.08] flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Customer, Phone, or TrxID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Order Status */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Order:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-white/15 rounded px-2.5 py-1.5 text-white text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAYMENT_UNDER_REVIEW">Payment Review</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-zinc-950 border border-white/15 rounded px-2.5 py-1.5 text-white text-xs"
            >
              <option value="ALL">All Payments</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="PAID">Paid / Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-zinc-400 uppercase tracking-widest">
            Loading Orders Database...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-400">
            No orders match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Advance TrxID</th>
                  <th className="p-3">Total / Advance</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {orders.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-zinc-900/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-white">
                      {ord.id}
                    </td>
                    <td className="p-3 text-zinc-400 font-mono text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <strong className="text-white block">{ord.customerName}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">{ord.customerPhone}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-amber-200 font-bold block">{ord.transactionId}</span>
                      <span className="text-[10px] text-zinc-400">{ord.paymentMethod}</span>
                    </td>
                    <td className="p-3 font-mono">
                      <div className="font-bold text-white">৳{ord.grandTotal.toLocaleString()}</div>
                      <div className="text-[10px] text-amber-300">Adv: ৳{ord.advancePaid}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : ord.paymentStatus === 'REJECTED'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-zinc-900 border border-white/10 text-zinc-200">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(ord);
                        }}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[11px] font-semibold"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Order Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-4xl bg-[#111116] rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
                  Order Dossier
                </span>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                  {selectedOrder.id}
                </h2>
                <span className="text-xs text-zinc-400 font-mono">
                  Booked on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowInvoice(true)}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs border border-white/10 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Payment Verification Decision Box */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-white/10 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="uppercase tracking-widest font-bold text-white font-cinzel flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>bKash / Nagad Advance Payment Verification</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedOrder.paymentStatus === 'PAID'
                      ? 'bg-emerald-950 text-emerald-400'
                      : selectedOrder.paymentStatus === 'REJECTED'
                      ? 'bg-rose-950 text-rose-400'
                      : 'bg-amber-950 text-amber-300'
                  }`}
                >
                  Status: {selectedOrder.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Method</span>
                  <strong className="text-white text-sm">{selectedOrder.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Transaction ID (TrxID)</span>
                  <strong className="font-mono text-amber-200 text-sm select-all">{selectedOrder.transactionId}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Sender Number</span>
                  <strong className="font-mono text-white text-sm select-all">{selectedOrder.senderPhone}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Advance Amount</span>
                  <strong className="font-mono text-emerald-400 text-sm">৳{selectedOrder.advancePaid}</strong>
                </div>
              </div>

              {/* Optional screenshot */}
              {selectedOrder.paymentScreenshot && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase text-zinc-400 block mb-1">Attached Payment Receipt:</span>
                  <a href={selectedOrder.paymentScreenshot} target="_blank" rel="noreferrer" className="inline-block">
                    <img
                      src={selectedOrder.paymentScreenshot}
                      alt="Payment Receipt"
                      className="w-32 h-32 object-cover rounded border border-white/10 hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-white/5">
                <button
                  onClick={() => handlePaymentAction('APPROVE', 'Verified by admin against merchant statement')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Payment</span>
                </button>

                <button
                  onClick={() => handlePaymentAction('REJECT', 'TrxID does not match statement')}
                  className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Payment</span>
                </button>

                <button
                  onClick={() => handlePaymentAction('REQUEST_NEW_TRX', 'Please submit corrected transaction details')}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Request New TrxID
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-zinc-950/60 p-4 rounded-xl border border-white/5">
              <div className="space-y-1">
                <span className="uppercase text-zinc-500 font-semibold block text-[10px]">Client Information</span>
                <strong className="text-white text-sm block">{selectedOrder.customerName}</strong>
                <p className="text-zinc-400 font-mono">Phone: {selectedOrder.customerPhone}</p>
                <p className="text-zinc-400">Email: {selectedOrder.customerEmail}</p>
              </div>

              <div className="space-y-1">
                <span className="uppercase text-zinc-500 font-semibold block text-[10px]">Shipping Destination</span>
                <p className="text-zinc-300">
                  {selectedOrder.shippingAddress.fullAddress}, {selectedOrder.shippingAddress.area},{' '}
                  {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.division}
                </p>
                <p className="text-zinc-500 text-[11px]">
                  Method: <strong className="text-zinc-300">{selectedOrder.deliveryMethod}</strong>
                </p>
                {selectedOrder.shippingAddress.notes && (
                  <p className="text-amber-200/90 italic text-[11px]">
                    Note: "{selectedOrder.shippingAddress.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                Ordered Garments ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-zinc-950">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-12 object-cover rounded bg-zinc-900" />
                      <div>
                        <strong className="text-white block">{item.name}</strong>
                        <span className="text-zinc-400">
                          Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex justify-end p-2 text-xs">
                <div className="w-64 space-y-1 text-right">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-mono">৳{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-rose-400">
                      <span>Discount:</span>
                      <span className="font-mono">-৳{selectedOrder.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery:</span>
                    <span className="text-white font-mono">৳{selectedOrder.shippingCharge}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-white/10">
                    <span>Grand Total:</span>
                    <span className="font-mono">৳{selectedOrder.grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>Advance Paid:</span>
                    <span className="font-mono">৳{selectedOrder.advancePaid}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Remaining COD:</span>
                    <span className="font-mono">৳{selectedOrder.remainingCOD.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Change Selector & Internal Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
              <div className="space-y-3">
                <span className="font-semibold text-zinc-300 block uppercase tracking-wider text-[11px]">
                  Update Order Pipeline Status
                </span>
                <div className="flex gap-2">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value as any)}
                    className="flex-1 px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-zinc-300 block uppercase tracking-wider text-[11px]">
                  Internal Admin Notes
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {selectedOrder.adminNotes?.map((n, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-zinc-950 text-[11px] text-zinc-300 border border-white/5">
                      • {n}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add confidential note (e.g. SF Tracking #)"
                    className="flex-1 px-2.5 py-1.5 rounded bg-zinc-950 border border-white/15 text-white text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-semibold text-xs"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice View */}
      {showInvoice && selectedOrder && (
        <PrintableInvoice
          order={selectedOrder}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};
