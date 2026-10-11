import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Crown,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Truck,
  PhoneCall,
  Gift
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface RichPeopleClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (route: string, params?: any) => void;
}

export const RichPeopleClubModal: React.FC<RichPeopleClubModalProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const { applyCouponCode } = useCart();
  const { success, info } = useToast();
  const [memberName, setMemberName] = useState('Gentleman of Distinction');
  const [isEditingName, setIsEditingName] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [applyingCode, setApplyingCode] = useState(false);

  if (!isOpen) return null;

  const vipCode = 'RICHPEOPLE';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(vipCode);
    setCopiedCode(true);
    success(`Vip code "${vipCode}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleApplyToCart = async () => {
    setApplyingCode(true);
    const result = await applyCouponCode(vipCode);
    setApplyingCode(false);
    if (result.success) {
      success(`15% VIP discount (${vipCode}) applied to your bag!`);
    } else {
      info(result.message);
    }
  };

  const perks = [
    {
      icon: <Gift className="w-4 h-4 text-amber-300" />,
      title: '15% Permanent Privilege',
      desc: 'Use VIP code RICHPEOPLE on any order above ৳3000 across all collections.',
    },
    {
      icon: <Scissors className="w-4 h-4 text-rose-300" />,
      title: 'Complimentary Monogramming',
      desc: 'Hand-stitched custom initials on your collar or French cuff by our Banani master tailors.',
    },
    {
      icon: <Truck className="w-4 h-4 text-emerald-300" />,
      title: 'White-Glove Express Dispatch',
      desc: 'Guaranteed expedited delivery in custom matte-black presentation boxes.',
    },
    {
      icon: <PhoneCall className="w-4 h-4 text-blue-300" />,
      title: 'Private Concierge Access',
      desc: 'Direct priority WhatsApp helpline (+880 1712-345678) for bespoke fitting consultations.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0e12] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden my-8">
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-rose-500 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold tracking-[0.25em] uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Sartorial Society</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-wider">
              THE RICH PEOPLE CLUB
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-playfair italic max-w-md mx-auto">
              "For patrons who appreciate uncompromising fabric density, bespoke silhouettes, and effortless dignity."
            </p>
          </div>

          {/* Digital VIP Membership Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#22070c] border border-amber-500/40 p-6 shadow-xl">
            {/* Ambient Gold Radial */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-400/90 font-bold block">
                  VIP PATRON PASS
                </span>
                <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-white">
                  RICH PEOPLE
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Crown className="w-5 h-5" />
              </div>
            </div>

            {/* Member Name Section */}
            <div className="space-y-1 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">Cardholder</span>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="bg-black/60 border border-amber-500/50 rounded px-2.5 py-1 text-sm text-amber-100 font-cinzel focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 bg-amber-600 text-white rounded text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-cinzel text-base sm:text-lg font-semibold text-amber-100">
                    {memberName}
                  </h4>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-[10px] text-zinc-400 hover:text-amber-300 underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-4 border-t border-white/10 gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Member ID</span>
                <span className="font-mono text-xs text-zinc-300 tracking-wider">RP-VIP-2026-9041</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Status</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center sm:justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Privileged & Active
                </span>
              </div>
            </div>
          </div>

          {/* VIP Coupon Banner with 1-Click Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#4a0e17]/50 via-zinc-900 to-zinc-900 border border-[#831828]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Exclusive VIP Privilege Voucher</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                15% discount on all orders over ৳3000
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="px-3 py-1.5 rounded bg-black/60 border border-white/20 font-mono text-xs font-bold text-amber-300 tracking-wider">
                {vipCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleApplyToCart}
                disabled={applyingCode}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {applyingCode ? 'Applying...' : 'Apply to Bag'}
              </button>
            </div>
          </div>

          {/* Privileges Grid */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-zinc-400 font-cinzel">
              Member Privileges & Amenities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {perks.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-black/40 border border-white/10 shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{p.title}</h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <span className="text-[11px] text-zinc-500 font-mono text-center sm:text-left">
              Banani Flagship Atelier · Dhaka, Bangladesh
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  navigate('/shop', { category: 'Rich People Exclusives' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-950/40"
              >
                <span>Browse Exclusives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
