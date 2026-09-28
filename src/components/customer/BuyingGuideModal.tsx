import React from 'react';
import { X, CheckCircle, ShieldAlert, Sparkles, Ruler, Award } from 'lucide-react';

export const BuyingGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Medical &amp; Ergonomic Sleep Reference
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-1">
            DreamNest Mattress Selection Guide
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            An objective guide to foam density, pocket coils, natural latex, and spinal posture alignment.
          </p>
        </div>

        <div className="space-y-6 text-xs text-[#524E48] leading-relaxed">
          {/* Section 1: Construction Types */}
          <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-2xl p-5 space-y-3">
            <h3 className="font-serif-display text-base font-bold text-[#1E1E1E]">
              1. Core Material Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#EFECE6]">
                <strong className="text-[#1E1E1E] block mb-1">Orthopedic Rebonded + HR Foam:</strong>
                Ideal for lower back pain, disc herniation, and heavier sleepers (&gt;80kg). High density (70D) prevents lumbar sinking.
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EFECE6]">
                <strong className="text-[#1E1E1E] block mb-1">Pocket Spring Hybrids:</strong>
                Zero partner disturbance. 800+ individually encased steel coils isolate motion, combined with top comfort layers.
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EFECE6]">
                <strong className="text-[#1E1E1E] block mb-1">100% Organic Natural Latex:</strong>
                Naturally hypoallergenic and anti-dust mite. Cooler sleep feel with buoyant, springy pushback without mechanical metal coils.
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EFECE6]">
                <strong className="text-[#1E1E1E] block mb-1">Gel Memory Foam:</strong>
                Pressure relief for sensitive joints. Infused cooling gel conductively dissipates body heat during sleep cycles.
              </div>
            </div>
          </div>

          {/* Section 2: Standard Dimensions */}
          <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-2xl p-5 space-y-3">
            <h3 className="font-serif-display text-base font-bold text-[#1E1E1E]">
              2. Standard Indian Cot Dimensions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E3DC] text-[11px] font-semibold text-[#8C7A6B]">
                    <th className="py-2">Standard Size</th>
                    <th className="py-2">Dimensions (Inches)</th>
                    <th className="py-2">Dimensions (cm)</th>
                    <th className="py-2">Recommended For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  <tr>
                    <td className="py-2 font-semibold text-[#1E1E1E]">Single</td>
                    <td>72" × 36"</td>
                    <td>182 × 91 cm</td>
                    <td>Children, individual cots</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-[#1E1E1E]">Twin</td>
                    <td>75" × 39"</td>
                    <td>190 × 99 cm</td>
                    <td>Students, daybeds</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-[#1E1E1E]">Double</td>
                    <td>75" × 54"</td>
                    <td>190 × 137 cm</td>
                    <td>Compact master bedrooms</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-[#1E1E1E]">Queen</td>
                    <td>78" × 60"</td>
                    <td>198 × 152 cm</td>
                    <td>Most popular couple size</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-[#1E1E1E]">King</td>
                    <td>78" × 72"</td>
                    <td>198 × 182 cm</td>
                    <td>Spacious luxury suites</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-[#1E1E1E]">Custom Size</td>
                    <td>Custom to 0.25"</td>
                    <td>Any Dimension</td>
                    <td>Antique cots, bespoke furniture</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
