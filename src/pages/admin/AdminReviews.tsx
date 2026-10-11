import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { Review } from '../../types/ecommerce';

export const AdminReviews: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        success(`Review ${status}`);
        fetchReviews();
      }
    } catch {
      error('Failed to update review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Review deleted');
        fetchReviews();
      }
    } catch {
      error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Social Proof Moderation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Client Appraisals & Reviews ({reviews.length})
          </h1>
        </div>
        <button onClick={fetchReviews} className="p-2 rounded bg-zinc-900 border border-white/10 text-zinc-300">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-5 rounded-xl bg-[#0e0e12] border border-white/[0.08] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <strong className="text-white text-sm">{r.title}</strong>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.status === 'approved'
                      ? 'bg-emerald-950 text-emerald-400'
                      : r.status === 'rejected'
                      ? 'bg-rose-950 text-rose-400'
                      : 'bg-amber-950 text-amber-300'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-zinc-300 italic">"{r.comment}"</p>
              <div className="text-zinc-500 text-[11px]">
                By <strong>{r.customerName}</strong> · {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {r.status !== 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(r.id, 'approved')}
                  className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              )}
              {r.status !== 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(r.id, 'rejected')}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
