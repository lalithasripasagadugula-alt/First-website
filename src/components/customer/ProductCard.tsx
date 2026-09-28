import React from 'react';
import { Heart, SlidersHorizontal, Check } from 'lucide-react';
import { Product } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { wishlist, toggleWishlist, comparedProducts, toggleCompare, settings } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = comparedProducts.includes(product.id);

  // Discounted price calculation
  const discountAmount = Math.round((product.basePrice * product.discountPercent) / 100);
  const finalPrice = product.basePrice - discountAmount;

  return (
    <div className="group bg-white border border-[#EBE7E0] rounded-2xl overflow-hidden hover:border-[#D5CFC9] transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-[#F4F1EC] overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Action icons (Wishlist & Compare) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/90 backdrop-blur-sm text-[#4A4540] hover:bg-white hover:text-[#1E1E1E]'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label="Wishlist"
          >
            <Heart size={15} className={isWishlisted ? 'fill-rose-600 text-rose-600' : ''} />
          </button>

          <button
            onClick={() => toggleCompare(product.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
              isCompared
                ? 'bg-[#1E1E1E] text-white'
                : 'bg-white/90 backdrop-blur-sm text-[#4A4540] hover:bg-white hover:text-[#1E1E1E]'
            }`}
            title={isCompared ? 'Added to comparison' : 'Compare mattress'}
            aria-label="Compare"
          >
            {isCompared ? <Check size={14} /> : <SlidersHorizontal size={14} />}
          </button>
        </div>

        {/* Quiet status or discount tag (unboxed text) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[#1E1E1E] shadow-xs">
          <span>{product.discountPercent}% OFF</span>
          {product.isBestSeller && (
            <>
              <span aria-hidden="true" className="text-[#8C7A6B]">·</span>
              <span className="text-[#B88E2F]">Best Seller</span>
            </>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Firmness - Zero Pill */}
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1.5">
            <span className="font-medium text-[#9E9790] uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
            <span>{product.firmness}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-base font-semibold text-[#1E1E1E] hover:text-[#8C7A6B] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#66615C] mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Ratings & reviews count */}
          <div className="flex items-center gap-2 mt-3 text-xs text-[#66615C]">
            <RatingStars rating={product.ratings.quality} size={13} showScore />
            <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
            <span>{product.reviewsCount} reviews</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-[#F2EFE9] flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#1E1E1E] font-tabular">
                {settings.currencySymbol}{finalPrice.toLocaleString()}
              </span>
              <span className="text-xs text-[#9E9790] line-through font-tabular">
                {settings.currencySymbol}{product.basePrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] text-[#78716C] block mt-0.5">
              EMI from {settings.currencySymbol}{product.emiStartingAt}/mo
            </span>
          </div>

          <button
            onClick={() => onSelect(product)}
            className="py-2 px-3.5 text-xs font-semibold text-[#1E1E1E] bg-[#FAF8F5] hover:bg-[#1E1E1E] hover:text-white border border-[#E8E3DC] hover:border-[#1E1E1E] rounded-xl transition-all duration-200 cursor-pointer"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
};
