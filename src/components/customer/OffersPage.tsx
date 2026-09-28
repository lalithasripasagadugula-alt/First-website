import React, { useState } from 'react';
import { Tag, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OffersPage: React.FC<{ onShopClick: () => void }> = ({ onShopClick }) => {
  const { coupons, settings } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
          Direct Factory Promotions
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1E1E1E]">
          Active Offers &amp; Verified Savings
        </h1>
        <p className="text-sm text-[#524E48] leading-relaxed">
          Apply these coupon codes at checkout to unlock factory-direct discounts on mattresses and sleep accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#E8E3DC] rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-[#D5CFC9] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-wider">
                  {c.discountType === 'flat' ? 'Flat Discount' : 'Percentage Savings'}
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                  Active
                </span>
              </div>

              <div className="font-serif-display text-3xl font-bold text-[#1E1E1E]">
                {c.discountType === 'flat' ? `${settings.currencySymbol}${c.value} OFF` : `${c.value}% OFF`}
              </div>

              <p className="text-xs text-[#524E48] leading-relaxed">
                Valid on orders above {settings.currencySymbol}{c.minOrderValue.toLocaleString()}.
                {c.maxDiscount ? ` Maximum discount capped at ${settings.currencySymbol}${c.maxDiscount.toLocaleString()}.` : ''}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] pt-1">
                <Clock size={12} />
                <span>Valid through {c.endDate}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EFECE6] flex items-center justify-between gap-3">
              <div className="bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-mono font-bold text-xs text-[#1E1E1E]">
                {c.code}
              </div>

              <button
                onClick={() => handleCopy(c.code)}
                className="py-2 px-3.5 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedCode === c.code ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-3xl p-8 text-center space-y-3">
        <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
          Ready to Upgrade Your Sleep?
        </h3>
        <p className="text-xs text-[#78716C] max-w-md mx-auto">
          Every mattress comes with a 100-night home trial and 10-year factory warranty.
        </p>
        <button
          onClick={onShopClick}
          className="py-2.5 px-6 bg-[#1E1E1E] text-white text-xs font-semibold rounded-full hover:bg-[#33312E] transition-colors cursor-pointer"
        >
          Browse All Mattresses
        </button>
      </div>
    </div>
  );
};
