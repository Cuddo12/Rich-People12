import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ShieldCheck,
  MapPin,
  Crown,
  Sparkles,
  MoreVertical,
  Package,
  Award,
  Phone,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RichPeopleClubModal } from '../vip/RichPeopleClubModal';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string, params?: any) => void;
  announcementText?: string;
  isAnnouncementEnabled?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  announcementText = 'FREE SHIPPING ON ALL ORDERS OVER ৳5000 ACROSS BANGLADESH',
  isAnnouncementEnabled = true,
}) => {
  const { itemCount, openCartDrawer } = useCart();
  const { wishlist } = useWishlist();
  const [threeDotMenuOpen, setThreeDotMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vipModalOpen, setVipModalOpen] = useState(false);

  // Lock scroll and handle Escape key when 3-dot all-white menu is open
  useEffect(() => {
    if (threeDotMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setThreeDotMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [threeDotMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop', { search: searchQuery.trim() });
      setSearchOpen(false);
      setThreeDotMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop All', route: '/shop' },
    { label: 'Exclusives', route: '/shop', category: 'Rich People Exclusives' },
    { label: 'Shirts', route: '/shirts' },
    { label: 'Panjabi', route: '/panjabi' },
    { label: 'Collections', route: '/collections' },
    { label: 'Our Story', route: '/about' },
    { label: 'Track Order', route: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/95 backdrop-blur-md border-b border-white/[0.08]">
      {/* Top Announcement Bar */}
      {isAnnouncementEnabled && (
        <div className="bg-gradient-to-r from-[#4a0e17] via-[#831828] to-[#4a0e17] text-white px-4 py-1.5 text-center text-[11px] font-medium tracking-widest uppercase border-b border-white/10 flex items-center justify-center gap-2">
          <span>{announcementText}</span>
        </div>
      )}

      {/* Main Top Bar: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          {/* Mobile 3-dot Menu Toggle: White background on click/active */}
          <button
            onClick={() => setThreeDotMenuOpen(!threeDotMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
              threeDotMenuOpen
                ? 'bg-white text-zinc-950 shadow-md ring-2 ring-white/60'
                : 'text-zinc-300 hover:text-white hover:bg-white/10 active:bg-white active:text-zinc-950'
            }`}
            aria-label="3-dot mobile menu"
            title="3-dot Menu"
          >
            <MoreVertical className="w-5 h-5 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-left group"
          >
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.16em] text-white transition-colors duration-200 group-hover:text-amber-100">
              RICH PEOPLE
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-widest uppercase font-medium text-zinc-300">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`transition-all duration-200 hover:text-white relative py-1 ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-400'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e11d48]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Rich People VIP Club Button */}
          <button
            onClick={() => setVipModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-950/40 to-amber-500/20 border border-amber-500/50 hover:border-amber-400 text-amber-200 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-amber-950/40 group"
            title="Open Rich People Club VIP Lounge"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">VIP CLUB</span>
          </button>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-zinc-300 hover:text-white p-2 transition-colors relative"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            className="text-zinc-300 hover:text-white p-2 transition-colors relative"
            aria-label="View wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#831828] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            onClick={openCartDrawer}
            className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-md border border-white/10 transition-colors"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4 text-amber-200" />
            <span className="text-xs font-semibold tabular-nums">
              Bag ({itemCount})
            </span>
          </button>

          {/* Admin / Portal link */}
          <button
            onClick={() => navigate('/admin')}
            className="text-zinc-400 hover:text-white p-2 transition-colors text-xs flex items-center gap-1 border border-white/5 hover:border-white/20 rounded px-2.5 py-1.5"
            title="Admin Management"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline font-mono text-[11px] tracking-wider">ADMIN</span>
          </button>

          {/* 3-Dot Options Menu: Turns WHITE background when clicked/active */}
          <button
            onClick={() => setThreeDotMenuOpen(!threeDotMenuOpen)}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
              threeDotMenuOpen
                ? 'bg-white text-zinc-950 shadow-lg ring-2 ring-white/60'
                : 'text-zinc-300 hover:text-white hover:bg-white/10 active:bg-white active:text-zinc-950'
            }`}
            aria-label="3-dot options menu"
            title="More Options (3-Dot)"
          >
            <MoreVertical className="w-5 h-5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-white/[0.08] bg-[#121216] px-4 py-3 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, fabric (Egyptian cotton, silk), or SKU..."
              className="w-full bg-transparent border-none text-sm text-white placeholder-zinc-500 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-[#831828] hover:bg-[#991b1b] text-white rounded transition-colors uppercase tracking-wider shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* DEDICATED 3-DOT ALL-WHITE INTERFACE (FULL SCREEN PURE WHITE BACKGROUND) */}
      {threeDotMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-white text-zinc-900 overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-label="3-dot Menu Interface"
        >
          {/* Top Bar of 3-Dot All-White Interface */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Active 3-Dot Badge with white background & dark dots */}
              <div
                className="p-2 rounded-lg bg-zinc-900 text-white shadow-sm flex items-center justify-center"
                title="3-Dot Menu Active"
              >
                <MoreVertical className="w-5 h-5" />
              </div>
              <div>
                <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.16em] text-zinc-950 block">
                  RICH PEOPLE
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                  Atelier Navigation & VIP Concierge
                </span>
              </div>
            </div>

            <button
              onClick={() => setThreeDotMenuOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-300 hover:border-zinc-900 text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 transition-all text-xs font-semibold uppercase tracking-wider"
              aria-label="Close 3-dot menu"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main 3-Dot Menu Content - ONLY 3-DOT MENUS VISIBLE */}
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 flex-1">
            {/* Search Input directly inside 3-dot menu */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shirts, panjabi, Egyptian cotton, or SKU..."
                  className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 text-sm text-zinc-900 placeholder-zinc-400 bg-zinc-50 transition-all outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* VIP Club Privilege Feature Card inside 3-dot menu */}
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-widest uppercase text-amber-900 font-mono">
                      Privilege Lounge
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                      15% VIP CODE
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 mt-0.5">
                    The Rich People VIP Club
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1">
                    Unlock secret drops, bespoke brass accents, complimentary monogramming, and concierge dispatch.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setThreeDotMenuOpen(false);
                  setVipModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#831828] hover:bg-[#991b1b] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Enter VIP Lounge</span>
              </button>
            </div>

            {/* Columns of Menus in 3-Dot Interface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Column 1: Store Categories & Catalog */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3 pb-2 border-b border-zinc-200">
                  Store Menus & Drops
                </h4>
                <div className="space-y-1.5">
                  {navLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.category) {
                          navigate(item.route, { category: item.category });
                        } else {
                          navigate(item.route);
                        }
                        setThreeDotMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-zinc-100 border border-transparent hover:border-zinc-200 text-left transition-all group"
                    >
                      <div>
                        <span className="text-sm font-semibold text-zinc-950 group-hover:text-[#831828] transition-colors block">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {item.category === 'Rich People Exclusives'
                            ? 'Silk, Handloom & Bespoke Brass Accents'
                            : item.route === '/shirts'
                            ? 'Full Sleeve, Egyptian Cotton & Linen'
                            : item.route === '/panjabi'
                            ? 'Royal Hand-Embroidered & Eid Series'
                            : item.route === '/shop'
                            ? 'Browse complete luxury catalog'
                            : item.route === '/track'
                            ? 'Lookup live order status'
                            : item.route === '/about'
                            ? 'Our Atelier Story & Craftsmanship'
                            : 'Explore curated garment collection'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 2: Concierge, Services & Tools */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3 pb-2 border-b border-zinc-200">
                  Concierge & Client Services
                </h4>
                <div className="space-y-2">
                  {/* Track Order */}
                  <button
                    onClick={() => {
                      navigate('/track');
                      setThreeDotMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-100 border border-zinc-200 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-[#831828] group-hover:text-white text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <strong className="text-xs font-bold text-zinc-950 block group-hover:text-[#831828] transition-colors">
                        Track Order & Delivery
                      </strong>
                      <span className="text-[11px] text-zinc-500">
                        Check live order status via Order ID & phone
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Shopping Bag */}
                  <button
                    onClick={() => {
                      setThreeDotMenuOpen(false);
                      openCartDrawer();
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-100 border border-zinc-200 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-zinc-950 block">
                          Shopping Bag
                        </strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 text-zinc-800">
                          {itemCount} items
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        Review selected garments and proceed to checkout
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      navigate('/wishlist');
                      setThreeDotMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-100 border border-zinc-200 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-[#831828] group-hover:text-white text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-zinc-950 block group-hover:text-[#831828] transition-colors">
                          Client Wishlist
                        </strong>
                        {wishlist.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-[#831828]">
                            {wishlist.length} saved
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        View your saved luxury pieces
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Our Atelier Story */}
                  <button
                    onClick={() => {
                      navigate('/about');
                      setThreeDotMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-100 border border-zinc-200 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <strong className="text-xs font-bold text-zinc-950 block">
                        Our Atelier Story & Craftsmanship
                      </strong>
                      <span className="text-[11px] text-zinc-500">
                        Dhaka heritage, luxury fabrics & quality standards
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Contact Concierge */}
                  <button
                    onClick={() => {
                      navigate('/contact');
                      setThreeDotMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-100 border border-zinc-200 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-800 flex items-center justify-center shrink-0 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <strong className="text-xs font-bold text-zinc-950 block">
                        Contact Concierge Support
                      </strong>
                      <span className="text-[11px] text-zinc-500">
                        Direct phone, email & bespoke support
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Admin Console */}
                  <button
                    onClick={() => {
                      navigate('/admin');
                      setThreeDotMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-300 text-left transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-zinc-950 block">
                          Admin Management Console
                        </strong>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-200 text-zinc-800 uppercase">
                          Staff Portal
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        Manage inventory, verify bKash payments & track orders
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar of 3-Dot Interface */}
          <div className="bg-zinc-50 border-t border-zinc-200 px-4 sm:px-8 py-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#831828]" />
                <span>Banani, Dhaka, Bangladesh • Nationwide Express Delivery</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-emerald-700 font-semibold">100% Authentic Handcrafted Luxury</span>
                <button
                  onClick={() => setThreeDotMenuOpen(false)}
                  className="text-xs font-semibold text-zinc-900 underline hover:text-[#831828]"
                >
                  Back to Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Rich People VIP Club Modal */}
      <RichPeopleClubModal
        isOpen={vipModalOpen}
        onClose={() => setVipModalOpen(false)}
        navigate={navigate}
      />
    </header>
  );
};
