import React, { useState, useEffect } from 'react';
import { Mail, Check, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { ContactMessage } from '../../types/ecommerce';

export const AdminMessages: React.FC = () => {
  const { token } = useAdminAuth();
  const { success } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        success('Marked as read');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Concierge Inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Incoming Messages ({messages.length})
          </h1>
        </div>
        <button onClick={fetchMessages} className="p-2 rounded bg-zinc-900 border border-white/10 text-zinc-300">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-xl border text-xs space-y-2 transition-colors ${
              m.isRead
                ? 'bg-[#0e0e12] border-white/5 text-zinc-400'
                : 'bg-[#181820] border-rose-500/30 text-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-white text-sm block">{m.subject}</strong>
                <p className="text-[11px] text-zinc-400">
                  From: <strong>{m.name}</strong> · Phone: {m.phone || 'N/A'} · Email: {m.email}
                </p>
              </div>

              {!m.isRead && (
                <button
                  onClick={() => markRead(m.id)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] uppercase tracking-wider font-semibold"
                >
                  Mark as Read
                </button>
              )}
            </div>

            <p className="p-3 rounded bg-zinc-950/60 border border-white/5 text-zinc-300 leading-relaxed">
              "{m.message}"
            </p>

            <span className="text-[10px] text-zinc-500 font-mono block">
              Received: {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
