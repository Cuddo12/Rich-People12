import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, History, Plus, Minus, Search, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Product, InventoryLog } from '../../types/ecommerce';

export const AdminInventory: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('Restock delivery from Dhaka atelier');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [prodRes, logsRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/inventory/logs', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || adjustAmount === 0) return;

    const newStock = Math.max(0, selectedProduct.stockQuantity + adjustAmount);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stockQuantity: newStock }),
      });

      if (res.ok) {
        success(`Stock updated for "${selectedProduct.name}" to ${newStock}`);
        setSelectedProduct(null);
        setAdjustAmount(0);
        fetchData();
      } else {
        error('Failed to update stock');
      }
    } catch {
      error('Network error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Warehouse Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Inventory & Stock Audit
          </h1>
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products Stock Level (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel">
              Current Garment Stock Levels
            </h2>
            <div className="relative w-48">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2.5 py-1 text-xs rounded bg-zinc-950 border border-white/10 text-white"
              />
              <Search className="w-3 h-3 text-zinc-500 absolute right-2 top-2" />
            </div>
          </div>

          <div className="divide-y divide-white/5 max-h-[550px] overflow-y-auto">
            {filteredProducts.map((p) => {
              const isLow = p.stockQuantity <= p.lowStockThreshold;
              return (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.featuredImage || p.images[0]} alt="" className="w-10 h-12 object-cover rounded bg-zinc-950" />
                    <div>
                      <strong className="text-white block line-clamp-1">{p.name}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">SKU: {p.sku}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-sm block ${
                          isLow ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {p.stockQuantity} pcs
                      </span>
                      {isLow && (
                        <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">
                          Low Stock Alert
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setAdjustAmount(0);
                      }}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold"
                    >
                      Adjust
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log Stream (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-3 border-b border-white/10 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-200" />
            <span>Real-time Inventory Audit Trail</span>
          </h2>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {logs.map((l) => (
              <div key={l.id} className="p-3 rounded-lg bg-zinc-950/60 border border-white/5 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <strong className="text-white truncate max-w-[200px]">{l.productName}</strong>
                  <span
                    className={`font-mono font-bold text-xs flex items-center gap-0.5 ${
                      l.quantityChange > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {l.quantityChange > 0 ? '+' : ''}{l.quantityChange} pcs
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{l.reason}</p>
                <div className="text-[10px] text-zinc-500 font-mono flex justify-between">
                  <span>Balance: {l.newStock} pcs</span>
                  <span>{new Date(l.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md bg-[#111116] rounded-xl border border-white/15 p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="text-base font-cinzel font-bold text-white">
              Adjust Stock: {selectedProduct.name}
            </h3>
            <p className="text-xs text-zinc-400">
              Current Stock in Warehouse: <strong className="text-white font-mono">{selectedProduct.stockQuantity} pcs</strong>
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Stock Change (e.g. +20 to restock, or -5 to deduct)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white font-mono text-sm"
                  required
                />
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  New resulting stock: <strong>{Math.max(0, selectedProduct.stockQuantity + adjustAmount)} pcs</strong>
                </span>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Adjustment Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Factory delivery or damaged sample"
                  className="w-full px-3 py-2 rounded bg-zinc-950 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#831828] hover:bg-[#991b1b] text-white font-bold rounded"
                >
                  Commit Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
