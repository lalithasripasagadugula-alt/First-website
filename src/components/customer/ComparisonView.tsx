import React from 'react';
import { X, Check, Plus, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import { Product } from '../../types';

interface ComparisonViewProps {
  onSelectProduct: (product: Product) => void;
  onBrowseMore: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  onSelectProduct,
  onBrowseMore,
}) => {
  const { products, comparedProducts, toggleCompare, clearComparison, settings } = useApp();

  const selectedList = products.filter((p) => comparedProducts.includes(p.id));

  if (selectedList.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center mx-auto mb-4 text-[#8C7A6B]">
          <ShoppingBag size={24} />
        </div>
        <h2 className="font-serif-display text-3xl font-bold text-[#1E1E1E]">
          Mattress Comparison Matrix
        </h2>
        <p className="text-sm text-[#66615C] mt-2 max-w-md mx-auto leading-relaxed">
          Select 2 to 4 mattresses to evaluate foam density, coil specs, orthopedic firmness, warranty, and landed retail prices side-by-side.
        </p>
        <button
          onClick={onBrowseMore}
          className="mt-6 py-3 px-6 bg-[#1E1E1E] text-white text-xs font-semibold rounded-full hover:bg-[#33312E] transition-colors cursor-pointer"
        >
          Browse All Mattresses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DC]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Side-by-Side Analysis
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Compare Selected Mattresses ({selectedList.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBrowseMore}
            className="py-2 px-4 text-xs font-semibold bg-white border border-[#D5CFC9] rounded-xl hover:bg-[#FAF8F5] text-[#1E1E1E] transition-colors cursor-pointer"
          >
            + Add Another
          </button>
          <button
            onClick={clearComparison}
            className="py-2 px-4 text-xs font-semibold text-[#8C7A6B] hover:text-rose-600 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto bg-white border border-[#E8E3DC] rounded-3xl shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E8E3DC] bg-[#FAF9F5]">
              <th className="p-4 w-48 font-semibold text-[#8C7A6B] uppercase tracking-wider text-[11px]">
                Specification
              </th>
              {selectedList.map((p) => (
                <th key={p.id} className="p-4 min-w-[240px] align-top">
                  <div className="relative space-y-2">
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#EFECE6] hover:bg-rose-100 hover:text-rose-600 text-[#78716C] flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X size={12} />
                    </button>
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F4F1EC] border border-[#E8E3DC]">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-semibold text-sm text-[#1E1E1E] line-clamp-1">{p.name}</div>
                    <div className="text-[11px] text-[#78716C]">{p.category}</div>
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="w-full py-1.5 px-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white font-semibold rounded-lg transition-colors cursor-pointer text-center text-xs"
                    >
                      Configure &amp; Buy
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EFECE6]">
            {/* Price */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Selling Price (Queen)</td>
              {selectedList.map((p) => {
                const discountAmount = Math.round((p.basePrice * p.discountPercent) / 100);
                const finalPrice = p.basePrice - discountAmount;
                return (
                  <td key={p.id} className="p-4">
                    <span className="text-sm font-bold text-[#1E1E1E] font-tabular">
                      {settings.currencySymbol}{finalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#9E9790] line-through ml-2 font-tabular">
                      {settings.currencySymbol}{p.basePrice.toLocaleString()}
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {p.discountPercent}% Off
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Firmness */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Firmness Profile</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-[#1E1E1E]">
                  {p.firmness}
                </td>
              ))}
            </tr>

            {/* Material */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Material Composition</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 text-[#524E48] leading-relaxed">
                  {p.material}
                </td>
              ))}
            </tr>

            {/* Foam Density */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Foam Density</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 font-mono text-[#1E1E1E]">
                  {p.foamDensity}
                </td>
              ))}
            </tr>

            {/* Thickness Options */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Available Thickness</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 text-[#1E1E1E]">
                  {p.thicknessOptions.map((t) => `${t}"`).join(', ')}
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Sag-Proof Warranty</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-[#1E1E1E]">
                  {p.warrantyYears} Years Coverage
                </td>
              ))}
            </tr>

            {/* Lifespan */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Expected Lifespan</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 text-[#524E48] font-tabular">
                  {p.expectedLifespanYears} Years
                </td>
              ))}
            </tr>

            {/* Weight Capacity */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Weight Capacity</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 font-tabular text-[#1E1E1E]">
                  {p.weightCapacityKg} kg per side
                </td>
              ))}
            </tr>

            {/* Quality Score */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Overall Quality Rating</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4">
                  <RatingStars rating={p.ratings.quality} size={12} showScore />
                </td>
              ))}
            </tr>

            {/* Comfort Rating */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Comfort Rating</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4">
                  <RatingStars rating={p.ratings.comfort} size={12} showScore />
                </td>
              ))}
            </tr>

            {/* Support Rating */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Spinal Support Rating</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4">
                  <RatingStars rating={p.ratings.support} size={12} showScore />
                </td>
              ))}
            </tr>

            {/* Delivery Time */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Standard Delivery Time</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 font-medium text-emerald-800">
                  {p.deliveryDays} Business Days
                </td>
              ))}
            </tr>

            {/* Home Trial */}
            <tr>
              <td className="p-4 font-medium text-[#524E48] bg-[#FAF9F5]">Trial Period</td>
              {selectedList.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-[#1E1E1E]">
                  {p.trialPeriodDays} Nights Risk-Free
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
