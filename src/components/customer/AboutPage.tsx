import React from 'react';
import { Award, ShieldCheck, Factory, HeartHandshake, CheckCircle } from 'lucide-react';
import { INITIAL_IMAGES } from '../../data/demoData';
import { useApp } from '../../context/AppContext';

export const AboutPage: React.FC<{ onShopClick: () => void }> = ({ onShopClick }) => {
  const { settings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
          Direct Factory Craftsmanship
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1E1E1E]">
          We Don't Just Resell Mattresses. We Manufacture Them.
        </h1>
        <p className="text-base text-[#524E48] leading-relaxed">
          DreamNest was founded on a simple principle: retail showroom markups of 300% on generic mattresses should not stand between everyday families and rejuvenating sleep. By building our own precision cold-lamination plant in Cherlapally, Hyderabad, we deliver true orthopedic sleep systems directly from factory floor to bedroom.
        </p>
      </div>

      {/* Facility Image with Highlights */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E8E3DC] aspect-[16/8] bg-[#F0EBE3]">
        <img
          src={INITIAL_IMAGES.hero}
          alt="DreamNest Manufacturing Engineering"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <span className="text-xs uppercase font-semibold text-[#C9A96E] tracking-wider">
            Cherlapally Manufacturing Unit 1 &amp; 2
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold mt-1">
            25,000 Sq. Ft. of Medical Ergonomic Precision
          </h2>
          <p className="text-xs sm:text-sm text-[#D1CBC4] max-w-2xl mt-1 leading-relaxed">
            Equipped with multi-axis automated CNC foam contour cutting, automated Swiss pocket coil winders, and hot-melt solvent-free bonding lines.
          </p>
        </div>
      </div>

      {/* 3 Pillars of DreamNest Standard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F]">
            <Factory size={22} />
          </div>
          <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
            Direct Manufacturer Pricing
          </h3>
          <p className="text-xs text-[#66615C] leading-relaxed">
            By eliminating distributor tiers, regional warehouses, and showroom commissions, every rupee goes straight into higher foam density (55D/70D) and heavier gauge carbon steel springs.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F]">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
            Zero Sag 10-Year Warranty
          </h3>
          <p className="text-xs text-[#66615C] leading-relaxed">
            Every mattress batch undergoes 100,000-stroke hex-roller durability testing to certify less than 0.5 inch depression over a decade of continuous nightly usage.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F]">
            <Award size={22} />
          </div>
          <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
            Clean Air &amp; Non-Toxic
          </h3>
          <p className="text-xs text-[#66615C] leading-relaxed">
            We reject cheap petroleum volatile fillers. Certified with OEKO-TEX Standard 100 fabrics and CertiPUR-US foams with zero harmful off-gassing.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#1E1E1E] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
          Ready to Experience Restorative Sleep?
        </h2>
        <p className="text-xs sm:text-sm text-[#D1CBC4] max-w-lg mx-auto">
          Explore our mattresses with a 100-night in-home trial. If you don't wake up pain-free and refreshed, we'll pick it up and give you a full refund.
        </p>
        <button
          onClick={onShopClick}
          className="mt-2 py-3 px-8 bg-white hover:bg-[#F2EDE4] text-[#1E1E1E] text-xs font-semibold rounded-full transition-colors cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};
