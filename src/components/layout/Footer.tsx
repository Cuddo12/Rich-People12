import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Clock, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  navigate: (route: string, params?: any) => void;
  brandName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export const Footer: React.FC<FooterProps> = ({
  navigate,
  brandName = 'Rich People',
  phone = '+880 1712-345678',
  email = 'concierge@richpeople.fashion',
  address = 'Level 4, House 18, Road 11, Banani, Dhaka-1213, Bangladesh',
}) => {
  return (
    <footer className="bg-[#070709] border-t border-white/[0.08] text-zinc-400 text-sm">
      {/* Trust markers banner */}
      <div className="border-b border-white/[0.06] bg-zinc-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Fast Nationwide Delivery</p>
              <p className="text-[12px] text-zinc-500">Dhaka in 24-48 hrs, Outside in 3-4 days</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Verified Advance System</p>
              <p className="text-[12px] text-zinc-500">Manual bKash/Nagad ৳200 verification</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Hassle-Free Exchange</p>
              <p className="text-[12px] text-zinc-500">7-day sizing exchange guarantee</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#831828]/20 flex items-center justify-center text-rose-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wider">Live Order Tracking</p>
              <p className="text-[12px] text-zinc-500">Track real-time shipment status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <button
            onClick={() => navigate('/')}
            className="font-cinzel text-3xl font-bold tracking-[0.2em] text-white hover:text-amber-100 transition-colors"
          >
            {brandName}
          </button>
          <p className="text-xs uppercase tracking-widest text-[#e11d48] font-semibold">
            Premium quality at a fair price.
          </p>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Handcrafting sartorial excellence for the modern Bangladeshi gentleman. From high-thread-count Egyptian cotton shirts to bespoke embroidered Panjabis, we define quiet contemporary luxury.
          </p>

          <div className="pt-2 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <MapPin className="w-4 h-4 text-[#831828] shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Phone className="w-4 h-4 text-[#831828] shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Mail className="w-4 h-4 text-[#831828] shrink-0" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Shop Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-cinzel">Wardrobe</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                All Products
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/shirts')} className="hover:text-white transition-colors">
                Men's Shirts
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/panjabi')} className="hover:text-white transition-colors">
                Men's Panjabi
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/shop', { category: 'Cuban Collar Shirts' })} className="hover:text-white transition-colors">
                Cuban Collar Shirts
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/shop', { category: 'Eid Collection' })} className="hover:text-white transition-colors">
                Eid 2026 Collection
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/shop', { isSale: true })} className="hover:text-white transition-colors text-rose-400 font-medium">
                Privilege Sale
              </button>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-cinzel">Client Care</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/track')} className="hover:text-white transition-colors text-amber-200">
                Track Your Order
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                Our Story & Craft
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                Contact Concierge
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/shipping-policy')} className="hover:text-white transition-colors">
                Shipping & Delivery
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/returns')} className="hover:text-white transition-colors">
                Returns & Exchanges
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & bKash Note */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-cinzel">Payment & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                Terms of Service
              </button>
            </li>
          </ul>

          <div className="mt-4 p-3 rounded bg-zinc-900/60 border border-white/[0.06] text-[11px] leading-relaxed">
            <span className="text-zinc-200 font-semibold block mb-1">Manual Advance Payment</span>
            <span>Orders require ৳200 advance payment via bKash or Nagad Send Money. Balance is settled via Cash on Delivery.</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06] py-6 text-center text-[11px] text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 {brandName} Menswear Atelier. Handcrafted in Bangladesh. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="text-[10px] tracking-wider uppercase">bKash Verified</span>
            <span>·</span>
            <span className="text-[10px] tracking-wider uppercase">Nagad Verified</span>
            <span>·</span>
            <span className="text-[10px] tracking-wider uppercase">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
