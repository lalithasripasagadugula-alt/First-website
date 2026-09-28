import React, { useState } from 'react';
import { X, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFirmness, setSelectedFirmness] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Orthopedic', 'Memory Foam', 'Natural Latex', 'Luxury Hybrid', 'Pocket Spring', 'Custom Size'];
  const firmnessLevels = ['All', 'Extra Firm Orthopedic', 'Medium Firm', 'Balanced Medium', 'Medium Soft', 'Plush (Soft)'];

  const filtered = products.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    const matchesFirmness =
      selectedFirmness === 'All' || p.firmness === selectedFirmness;

    return matchesSearch && matchesCategory && matchesFirmness;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Input Bar */}
        <div className="p-4 border-b border-[#E8E3DC] flex items-center gap-3">
          <Search size={20} className="text-[#8C7A6B] ml-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search mattresses by model, firmness, or material (e.g. Ortho, Latex, Gel)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#1E1E1E] focus:outline-none placeholder-[#9E9790]"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="p-4 bg-[#FAF9F5] border-b border-[#E8E3DC] space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[#8C7A6B] font-semibold text-[11px] uppercase mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === c
                    ? 'bg-[#1E1E1E] text-white'
                    : 'bg-white border border-[#E2DDD5] text-[#524E48] hover:border-[#1E1E1E]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[#8C7A6B] font-semibold text-[11px] uppercase mr-1">Firmness:</span>
            {firmnessLevels.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFirmness(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedFirmness === f
                    ? 'bg-[#1E1E1E] text-white'
                    : 'bg-white border border-[#E2DDD5] text-[#524E48] hover:border-[#1E1E1E]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-[#EFECE6]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#78716C]">
              No mattresses matched your search filters. Try adjusting your query or category.
            </div>
          ) : (
            filtered.map((product) => {
              const discountAmount = Math.round((product.basePrice * product.discountPercent) / 100);
              const finalPrice = product.basePrice - discountAmount;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-[#F4F1EC] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8C7A6B] font-semibold uppercase">
                          {product.category}
                        </span>
                        <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
                        <span className="text-xs text-[#66615C]">{product.firmness}</span>
                      </div>
                      <h4 className="font-semibold text-xs text-[#1E1E1E] group-hover:text-[#8C7A6B] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#78716C] line-clamp-1">{product.tagline}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-tabular text-[#1E1E1E] block">
                      {settings.currencySymbol}{finalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {product.discountPercent}% Off
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
