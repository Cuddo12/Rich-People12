import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  Clock,
  ShieldCheck,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Printer,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, Product } from '../../types/ecommerce';
import { PrintableInvoice } from '../../components/invoice/PrintableInvoice';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectTab }) => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const fetchStats = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const handleQuickPaymentAction = async (orderId: string, action: 'APPROVE' | 'REJECT') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, adminNote: `Quick ${action.toLowerCase()} from Dashboard` }),
      });
      if (res.ok) {
        success(`Payment ${action.toLowerCase()}d for #${orderId}`);
        fetchStats();
      } else {
        error('Failed to update payment status');
      }
    } catch {
      error('Network error');
    }
  };

  if (loading && !stats) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#831828] mb-3" />
        <p className="text-xs uppercase tracking-widest text-zinc-400">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Welcome & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Live Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Atelier Executive Dashboard
          </h1>
        </div>

        <button
          onClick={fetchStats}
          className="px-3.5 py-2 rounded bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-xl bg-[#0e0e12] border border-white/[0.08] space-y-2">
          <div className="flex justify-between items-center text-zinc-400 text-xs">
            <span className="uppercase tracking-wider font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums block font-mono">
            ৳{stats?.totalSales?.toLocaleString() || 0}
          </span>
          <span className="text-[11px] text-zinc-500 block">
            Confirmed & Delivered Orders
          </span>
        </div>

        {/* Today's Sales */}
        <div className="p-5 rounded-xl bg-[#0e0e12] border border-white/[0.08] space-y-2">
          <div className="flex justify-between items-center text-zinc-400 text-xs">
            <span className="uppercase tracking-wider font-semibold">Today's Sales</span>
            <Package className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-amber-200 tabular-nums block font-mono">
            ৳{stats?.todaySales?.toLocaleString() || 0}
          </span>
          <span className="text-[11px] text-zinc-500 block">
            Booked today in BDT
          </span>
        </div>

        {/* Pending Payment Verification */}
        <div
          onClick={() => onSelectTab('orders')}
          className="p-5 rounded-xl bg-[#1f0b11] border border-rose-500/30 space-y-2 cursor-pointer hover:border-rose-500/60 transition-colors"
        >
          <div className="flex justify-between items-center text-rose-300 text-xs">
            <span className="uppercase tracking-wider font-semibold">Pending Payments</span>
            <ShieldCheck className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums block font-mono">
            {stats?.pendingPayments || 0}
          </span>
          <span className="text-[11px] text-rose-300/80 block">
            Awaiting bKash/Nagad verification →
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onSelectTab('inventory')}
          className="p-5 rounded-xl bg-[#141209] border border-amber-500/30 space-y-2 cursor-pointer hover:border-amber-500/60 transition-colors"
        >
          <div className="flex justify-between items-center text-amber-300 text-xs">
            <span className="uppercase tracking-wider font-semibold">Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums block font-mono">
            {stats?.lowStockCount || 0}
          </span>
          <span className="text-[11px] text-amber-300/80 block">
            Garments below threshold →
          </span>
        </div>
      </div>

      {/* Main Split: Recent Orders & Quick Verification (8 cols) + Top Products (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Queue */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm uppercase tracking-widest font-bold text-white font-cinzel">
                Recent Orders & Payment Queue
              </h2>
              <span className="text-[11px] text-zinc-400">
                Verify manual TrxIDs or update tracking
              </span>
            </div>
            <button
              onClick={() => onSelectTab('orders')}
              className="text-xs uppercase tracking-wider text-rose-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>View All ({stats?.totalOrders || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">TrxID / Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {stats?.recentOrders?.map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-white">
                      {ord.id}
                    </td>
                    <td className="p-3">
                      <strong className="text-white block">{ord.customerName}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">{ord.customerPhone}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-amber-200 font-bold block">{ord.transactionId}</span>
                      <span className="text-[10px] text-zinc-400">{ord.paymentMethod} (Sender: {ord.senderPhone})</span>
                    </td>
                    <td className="p-3 font-mono">
                      <div>Total: <strong>৳{ord.grandTotal.toLocaleString()}</strong></div>
                      <div className="text-[10px] text-zinc-400">Adv: ৳{ord.advancePaid}</div>
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
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      {ord.paymentStatus === 'PENDING_VERIFICATION' && (
                        <>
                          <button
                            onClick={() => handleQuickPaymentAction(ord.id, 'APPROVE')}
                            className="p-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded transition-colors"
                            title="Approve Payment"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleQuickPaymentAction(ord.id, 'REJECT')}
                            className="p-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded transition-colors"
                            title="Reject Payment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition-colors"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products & Low Stock Spotlight */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Selling Garments */}
          <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10">
              Top Selling Garments
            </h3>

            <div className="space-y-3">
              {stats?.topProducts?.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-12 object-cover rounded bg-zinc-950 shrink-0" />
                    <div>
                      <strong className="text-white line-clamp-1 block">{p.name}</strong>
                      <span className="text-[11px] text-zinc-400">{p.count} pieces sold</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    ৳{p.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-3 text-xs">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10">
              Quick Admin Actions
            </h3>
            <button
              onClick={() => onSelectTab('products')}
              className="w-full py-2.5 px-3 rounded bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex justify-between items-center transition-colors"
            >
              <span>+ Add New Product</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className="w-full py-2.5 px-3 rounded bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex justify-between items-center transition-colors"
            >
              <span>Update bKash / Nagad Number</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
            <button
              onClick={() => onSelectTab('reports')}
              className="w-full py-2.5 px-3 rounded bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex justify-between items-center transition-colors"
            >
              <span>Export Orders CSV Spreadsheet</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
