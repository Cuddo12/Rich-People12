import React, { useState, useEffect } from 'react';
import { Download, BarChart2, DollarSign, Package, TrendingUp, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminReports: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  const handleDownloadCSV = () => {
    if (!token) return;
    fetch('/api/admin/reports/csv', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `richpeople_orders_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        success('CSV report exported');
      })
      .catch(() => error('Failed to export CSV'));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Analytics & Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Financial Performance & CSV Export
          </h1>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Financial Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-2">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Gross Confirmed Revenue
          </span>
          <span className="text-3xl font-bold font-mono text-white block">
            ৳{stats?.totalSales?.toLocaleString() || 0}
          </span>
          <p className="text-[11px] text-zinc-500">Excluding cancelled or unverified bookings</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-2">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Completed Bookings
          </span>
          <span className="text-3xl font-bold font-mono text-white block">
            {stats?.totalOrders || 0}
          </span>
          <p className="text-[11px] text-zinc-500">Total transaction orders in ledger</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-2">
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            Total Unique Customers
          </span>
          <span className="text-3xl font-bold font-mono text-white block">
            {stats?.totalCustomers || 0}
          </span>
          <p className="text-[11px] text-zinc-500">Dhaka & Nationwide patrons</p>
        </div>
      </div>

      {/* Sales by Category breakdown */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10">
          Revenue Distribution by Garment Category
        </h2>

        <div className="space-y-3">
          {stats?.categorySales &&
            Object.entries(stats.categorySales).map(([cat, val]: any) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-medium">{cat}</span>
                  <span className="font-mono text-zinc-300">৳{val.toLocaleString()}</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#831828] h-full"
                    style={{
                      width: `${Math.min(100, Math.round((val / (stats.totalSales || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
