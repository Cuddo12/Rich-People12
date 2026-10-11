import React from 'react';
import { Award, Scissors, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string, params?: any) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Editorial Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center border-b border-white/[0.08] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_luxury_menswear_1791384214280.jpg"
            alt="Rich People Atelier"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-black/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-16 space-y-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#e11d48] font-bold">
            The Rich People Manifesto
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-cinzel text-white leading-tight">
            Quiet Sartorial Refinement
          </h1>
          <p className="text-base sm:text-lg font-playfair italic text-zinc-300 max-w-2xl mx-auto">
            "Premium quality at a fair price."
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold font-cinzel">
            Chapter 01 · The Genesis
          </span>
          <h2 className="text-3xl font-bold font-cinzel text-white">
            Redefining Contemporary Bengali Menswear
          </h2>
          <p>
            Rich People was founded with a singular conviction: Bangladeshi gentlemen deserve impeccably tailored menswear that rivals global luxury houses without prohibitive markup.
          </p>
          <p>
            For decades, retail garments in Dhaka sacrificed either fabric longevity or precision silhouette. We chose to reject compromises. By directly sourcing 120s count Egyptian Giza cotton, Mulberry silk blends, and Normandy linen, we engineer garments built for tropical climate comfort and royal presence.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]">
          <img
            src="/src/assets/images/craftsmanship_fabric_banner_1791384259700.jpg"
            alt="Artisanal tailoring"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Craftsmanship Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#e11d48] font-bold">
            The Pillars
          </span>
          <h2 className="text-3xl font-bold font-cinzel text-white mt-1">
            Why Gentlemen Choose Rich People
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#831828]/20 flex items-center justify-center text-rose-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-cinzel text-white">100% Noble Fibers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never blend cheap polyester into our shirts or panjabis. Only natural long-staple cotton, certified Normandy flax linen, and mulberry silk blends.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#831828]/20 flex items-center justify-center text-rose-400">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-cinzel text-white">18 Stitches Per Inch</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Micro-density tailoring guarantees seam strength that does not pucker after repeated washings. Collars retain structured crispness with German interlining.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0f0f13] border border-white/[0.08] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#831828]/20 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-cinzel text-white">Fair Pricing Integrity</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              By controlling our own atelier in Dhaka, we eliminate middleman retail inflation. You receive genuine haute couture quality at an honest, democratic price point.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 pt-10">
        <h3 className="text-2xl font-cinzel font-bold text-white mb-4">
          Experience Sartorial Excellence
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/shirts')}
            className="px-8 py-3.5 bg-[#831828] hover:bg-[#991b1b] text-white text-xs uppercase tracking-widest font-bold rounded transition-colors"
          >
            Explore Shirts
          </button>
          <button
            onClick={() => navigate('/panjabi')}
            className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest font-bold rounded border border-white/10 transition-colors"
          >
            Explore Panjabi
          </button>
        </div>
      </section>
    </div>
  );
};
