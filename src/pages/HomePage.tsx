import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, ChevronRight, Award, Scissors, Star, Crown, Gift, Truck } from 'lucide-react';
import { Product, CategoryItem } from '../types/ecommerce';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { RichPeopleClubModal } from '../components/vip/RichPeopleClubModal';
import { useToast } from '../context/ToastContext';

interface HomePageProps {
  navigate: (route: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { success } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?limit=12'),
          fetch('/api/categories'),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const prods: Product[] = prodData.products || [];
          setFeaturedProducts(prods.filter((p) => p.isFeatured).slice(0, 4));
          setNewArrivals(prods.filter((p) => p.isNewArrival || p.category === 'Panjabi').slice(0, 4));
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      success('Thank you for subscribing to Rich People Privileges.');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/[0.08]">
        {/* Background Image with Cinematic Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_luxury_menswear_1791384214280.jpg"
            alt="Rich People Luxury Menswear"
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#4a0e17]/25 to-[#09090b]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/10 text-amber-200 text-xs uppercase tracking-[0.25em] mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
            <span>The 2026 Sartorial Panjabi & Shirt Collection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-cinzel font-extrabold tracking-[0.14em] text-white uppercase drop-shadow-2xl">
            RICH PEOPLE
          </h1>

          <p className="mt-4 text-base sm:text-xl font-playfair italic text-zinc-300 max-w-2xl mx-auto tracking-wide">
            "Premium quality at a fair price."
          </p>

          <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Handcrafted luxury Egyptian cotton dress shirts and bespoke embroidered Panjabis. Engineered with uncompromising fabric density for modern Bangladeshi gentlemen.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/shirts')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#831828] via-[#a11c30] to-[#831828] hover:from-[#991b1b] hover:to-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.2em] rounded transition-all duration-200 shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 group"
            >
              <span>Explore Shirts</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate('/panjabi')}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-[0.2em] rounded border border-white/20 transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 group"
            >
              <span>Explore Panjabi</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-amber-200" />
            </button>
          </div>

          {/* Quick Perks Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Award className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs">100% Giza & Supima Cotton</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Scissors className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs">Bespoke Royal Cut Drape</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs">৳200 Verified Advance COD</span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-300">
              <Star className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs">Rated 4.9/5 by Gentlemen</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Collections Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#e11d48] font-semibold">
              Curated Taxonomy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
              Select Your Wardrobe
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/shop`, { category: cat.name })}
              className="group relative h-96 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-amber-200 font-mono">
                  Collection
                </span>
                <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-amber-100 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#e11d48] transition-colors gap-1.5">
                  <span>Explore Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Spotlight Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-amber-200 font-semibold">
              Fresh Off The Loom
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop', { isNewArrival: true })}
            className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Browse Full Release</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={navigate}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. Craftsmanship & Fabric Story Banner */}
      <section className="relative overflow-hidden border-y border-white/[0.08] bg-[#121216]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#e11d48] font-bold">
              Uncompromising Standards
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-white leading-tight">
              Craftsmanship Engineered in Dhaka
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every Rich People piece is born from meticulous material sourcing. We import raw Giza double-twisted yarn, weave in high-density European looms, and tailor with 18 stitches per inch for unmatched collar firmness and cuff endurance.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <span className="font-cinzel text-2xl font-bold text-white">18 SPI</span>
                <p className="text-xs text-zinc-400">High-density micro stitches for lifetime seams</p>
              </div>
              <div className="space-y-1">
                <span className="font-cinzel text-2xl font-bold text-white">120/2</span>
                <p className="text-xs text-zinc-400">Double twisted Egyptian cotton count</p>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs uppercase tracking-widest font-semibold rounded border border-white/10 transition-colors"
              >
                Read Our Story & Craft
              </button>
            </div>
          </div>

          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="/src/assets/images/craftsmanship_fabric_banner_1791384259700.jpg"
              alt="Rich People Fabric Craftsmanship"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-zinc-300 italic font-playfair">
              "Touch reveals what vision merely anticipates."
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. THE RICH PEOPLE CLUB - VIP CONNOISSEURS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120508] via-[#101014] to-[#1c080e] border border-amber-500/30 p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-rose-900/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-bold uppercase tracking-[0.25em]">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Patrons of Sartorial Excellence</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-white leading-tight">
                THE RICH PEOPLE CLUB
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-playfair italic leading-relaxed">
                "Reserved for discerning gentlemen who value high GSM organic textiles, bespoke cuff embroidery, and prompt Dhaka dispatch."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">15% Lifetime Privilege</span>
                    <span className="text-[11px] text-zinc-400">Apply VIP voucher <span className="font-mono text-amber-300 font-semibold">RICHPEOPLE</span></span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Free Monogramming</span>
                    <span className="text-[11px] text-zinc-400">Hand-embroidered personal initials on placket</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">White-Glove Dispatch</span>
                    <span className="text-[11px] text-zinc-400">Expedited same-day courier in matte-black box</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Secret Eid Drops</span>
                    <span className="text-[11px] text-zinc-400">48-hour pre-access before public releases</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => setVipModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-black font-cinzel font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Crown className="w-4 h-4" />
                  <span>Claim VIP Privileges</span>
                </button>

                <button
                  onClick={() => navigate('/shop', { category: 'Rich People Exclusives' })}
                  className="px-6 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-white font-cinzel font-semibold text-xs uppercase tracking-widest rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Explore Exclusives</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => setVipModalOpen(true)}
                className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#2c0810] border-2 border-amber-500/50 p-6 shadow-2xl relative cursor-pointer hover:border-amber-400 transition-all transform hover:scale-[1.02] group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                      OFFICIAL CREDENTIAL
                    </span>
                    <h3 className="font-cinzel text-xl font-bold tracking-widest text-white mt-0.5">
                      RICH PEOPLE
                    </h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">VIP Patron Club</p>
                  </div>
                  <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                    <Crown className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-4 py-4 border-y border-white/10">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Voucher Code</span>
                    <span className="font-mono text-sm font-bold text-amber-300 tracking-widest">RICHPEOPLE (15% OFF)</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Atelier Location</span>
                    <span className="text-xs text-zinc-300">Level 4, Road 11, Banani, Dhaka</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs">
                  <span className="font-mono text-[11px] text-zinc-400">RP-VIP-2026-9041</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1 text-[11px] group-hover:translate-x-1 transition-transform">
                    Tap to Open Pass <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#e11d48] font-semibold">
              Gentlemen's Choice
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
              Signature Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigate('/shop', { isBestSeller: true })}
            className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              navigate={navigate}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-200 font-semibold">
            Social Proof
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
            Voices of Refinement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "The Premium Black Panjabi exceeded my expectations. The neckline embroidery is subtle and regal, and the fabric didn't crease even after a 6-hour family wedding."
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-xs">
              <strong className="text-white block">Adnan Chowdhury</strong>
              <span className="text-zinc-500">Corporate Banker · Gulshan, Dhaka</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "Finally, a Bangladeshi brand that understands collar interlining. The Egyptian cotton shirt stays sharp under my suit blazer all day. Outstanding delivery speed too."
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-xs">
              <strong className="text-white block">Rafid Mahmud</strong>
              <span className="text-zinc-500">Architect · Dhanmondi, Dhaka</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/40 border border-white/[0.08] space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "The manual bKash ৳200 verification was handled within 30 minutes, and the order was at my doorstep in Chittagong in two days. Truly professional service."
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-xs">
              <strong className="text-white block">Saifullah Qureshi</strong>
              <span className="text-zinc-500">Consultant · Chittagong</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Newsletter & Privileges */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 p-8 rounded-2xl bg-gradient-to-b from-[#181820] to-[#0c0c10] border border-white/10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#e11d48] font-bold">
          Rich People Atelier Privileges
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-2">
          Receive Early Access to Eid & Private Drops
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mt-2 mb-6">
          Subscribers receive confidential invitations to seasonal releases, coupon codes, and bespoke sizing consultations.
        </p>

        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded bg-zinc-950 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#831828] hover:bg-[#991b1b] text-white text-xs uppercase tracking-widest font-bold rounded transition-colors"
          >
            Join Privileges
          </button>
        </form>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        navigate={navigate}
      />

      {/* Rich People VIP Club Modal */}
      <RichPeopleClubModal
        isOpen={vipModalOpen}
        onClose={() => setVipModalOpen(false)}
        navigate={navigate}
      />
    </div>
  );
};
