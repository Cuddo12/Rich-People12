import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { SiteSettings } from '../../types/ecommerce';

export const AdminSettings: React.FC = () => {
  const { token } = useAdminAuth();
  const { success, error } = useToast();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState<number>(200);
  const [shippingDhaka, setShippingDhaka] = useState<number>(80);
  const [shippingOutside, setShippingOutside] = useState<number>(150);
  const [freeThreshold, setFreeThreshold] = useState<number>(5000);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [paymentInstructions, setPaymentInstructions] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data: SiteSettings = await res.json();
        setSettings(data);
        setBrandName(data.brandName);
        setTagline(data.tagline);
        setPhone(data.phone);
        setEmail(data.email);
        setAddress(data.address);
        setBkashNumber(data.bkashNumber);
        setNagadNumber(data.nagadNumber);
        setAdvanceAmount(data.advancePaymentAmount);
        setShippingDhaka(data.shippingChargeInsideDhaka);
        setShippingOutside(data.shippingChargeOutsideDhaka);
        setFreeThreshold(data.freeShippingThreshold);
        setAnnouncementText(data.announcementBar?.text || '');
        setAnnouncementEnabled(data.announcementBar?.enabled ?? true);
        setPaymentInstructions(data.paymentInstructions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const updated: Partial<SiteSettings> = {
        brandName,
        tagline,
        phone,
        email,
        address,
        bkashNumber,
        nagadNumber,
        advancePaymentAmount: Number(advanceAmount),
        shippingChargeInsideDhaka: Number(shippingDhaka),
        shippingChargeOutsideDhaka: Number(shippingOutside),
        freeShippingThreshold: Number(freeThreshold),
        announcementBar: {
          text: announcementText,
          enabled: announcementEnabled,
        },
        paymentInstructions,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        success('Site configurations saved successfully');
        fetchSettings();
      } else {
        error('Failed to update settings');
      }
    } catch {
      error('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return <div className="py-20 text-center text-xs text-zinc-400">Loading Configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
            Storefront & Logistics Policy
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Site, Shipping & Payment Settings
          </h1>
        </div>
        <button onClick={fetchSettings} className="p-2 rounded bg-zinc-900 border border-white/10 text-zinc-300">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* bKash & Nagad Settings */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-rose-400" />
            <span>Manual bKash & Nagad Send Money Account Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">bKash Send Money Number *</label>
              <input
                type="text"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Nagad Send Money Number *</label>
              <input
                type="text"
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                placeholder="018XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Required Advance Booking (BDT) *</label>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-zinc-300 font-semibold mb-1">Customer Payment Instructions</label>
              <textarea
                rows={2}
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates & Threshold */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-200" />
            <span>Shipping Charges & Free Delivery Threshold</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Inside Dhaka Charge (BDT)</label>
              <input
                type="number"
                value={shippingDhaka}
                onChange={(e) => setShippingDhaka(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Outside Dhaka Charge (BDT)</label>
              <input
                type="number"
                value={shippingOutside}
                onChange={(e) => setShippingOutside(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Free Delivery Threshold (BDT)</label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Brand & Top Announcement Bar */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10">
            Brand Identity & Announcement Bar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Concierge Hotline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Flagship Atelier Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ann-enabled"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="accent-[#831828]"
                />
                <label htmlFor="ann-enabled" className="text-zinc-300 font-semibold">
                  Enable Top Announcement Bar
                </label>
              </div>

              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. FREE SHIPPING ON ORDERS OVER ৳5000"
                className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#831828] hover:bg-[#991b1b] text-white font-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-lg shadow-rose-950/40"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
