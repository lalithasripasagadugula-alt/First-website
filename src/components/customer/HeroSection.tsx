import React from 'react';
import { ArrowRight, Sparkles, Shield, Clock, Award } from 'lucide-react';
import { INITIAL_IMAGES } from '../../data/demoData';

interface HeroSectionProps {
  onShopClick: () => void;
  onExploreClick: () => void;
  onSelectCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onExploreClick,
  onSelectCategory,
}) => {
  const categories = [
    'Memory Foam',
    'Orthopedic',
    'Pocket Spring',
    'Bonnell Spring',
    'Natural Latex',
    'Luxury Hybrid',
    'Custom Size',
    'Budget Comfort',
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAF9F5] border-b border-[#E8E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Intent */}
          <div className="lg:col-span-6 space-y-6">
            {/* Small editorial kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
              <span>Handcrafted Sleep Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Cherlapally Plant</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1E1E] leading-[1.08] text-balance">
              Better Sleep Starts With Better Comfort
            </h1>

            <p className="text-base sm:text-lg text-[#524E48] leading-relaxed max-w-xl">
              Engineered with medical-grade high-density orthopedic cores, individually wrapped pocket springs, and breathable organic fabrics. Made to order directly at our factory to eliminate distributor markups.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onShopClick}
                className="py-3.5 px-7 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-sm flex items-center gap-2.5 cursor-pointer"
              >
                <span>Shop Mattresses</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onExploreClick}
                className="py-3.5 px-6 bg-white hover:bg-[#F2EDE4] text-[#1E1E1E] border border-[#D5CFC9] text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer"
              >
                Explore Collection
              </button>
            </div>

            {/* Adjacent Proof Metrics */}
            <div className="pt-8 border-t border-[#E8E3DC] grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="font-serif-display text-2xl font-bold text-[#1E1E1E] block font-tabular">
                  10 Years
                </span>
                <span className="text-xs text-[#78716C] mt-0.5 block">
                  Sag-Proof Warranty
                </span>
              </div>
              <div>
                <span className="font-serif-display text-2xl font-bold text-[#1E1E1E] block font-tabular">
                  100 Nights
                </span>
                <span className="text-xs text-[#78716C] mt-0.5 block">
                  Home Sleep Trial
                </span>
              </div>
              <div>
                <span className="font-serif-display text-2xl font-bold text-[#1E1E1E] block font-tabular">
                  120k+
                </span>
                <span className="text-xs text-[#78716C] mt-0.5 block">
                  Rejuvenated Sleepers
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity Hero Imagery */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5E0D8] bg-[#F0EBE3] aspect-[16/10] sm:aspect-[16/11]">
              <img
                src={INITIAL_IMAGES.hero}
                alt="DreamNest Handcrafted Luxury Mattress in Master Bedroom"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Floating Craftsmanship Badge (quiet unboxed metadata) */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-white/95 backdrop-blur-md border border-[#E8E3DC] rounded-2xl p-4 shadow-lg flex items-center gap-3.5 max-w-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#B88E2F] shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1E1E1E]">Direct Factory Fabrication</h4>
                  <p className="text-[11px] text-[#78716C] leading-tight mt-0.5">
                    Multi-layer cold-laminated pressure zones with zero toxic off-gassing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Shelf */}
        <div className="mt-14 pt-8 border-t border-[#E8E3DC]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
              Browse By Sleep Need &amp; Construction
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="py-2 px-4 rounded-xl text-xs font-medium bg-white hover:bg-[#1E1E1E] hover:text-white border border-[#E2DDD5] text-[#3C3836] transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-xs"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
