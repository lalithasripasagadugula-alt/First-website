import React, { useState } from 'react';
import {
  X,
  Heart,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Check,
  Sparkles,
  Info,
  Calendar,
  Layers,
  MapPin,
  Star,
  Plus,
  Minus,
} from 'lucide-react';
import { Product, MattressStandardSize } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { useApp } from '../../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCart,
}) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    comparedProducts,
    toggleCompare,
    calculateMattressPrice,
    reviews,
    addReview,
    settings,
    currentCustomer,
  } = useApp();

  if (!product) return null;

  // Selected Options
  const [selectedSize, setSelectedSize] = useState<MattressStandardSize>(
    product.standardSizes.includes('Queen') ? 'Queen' : product.standardSizes[0]
  );
  const [selectedThickness, setSelectedThickness] = useState<number>(
    product.thicknessOptions[0] || 6
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Custom Dimensions State
  const [customLength, setCustomLength] = useState<number>(78);
  const [customWidth, setCustomWidth] = useState<number>(60);
  const [customThickness, setCustomThickness] = useState<number>(8);

  // Pincode checker state
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState(currentCustomer?.name || '');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);

  // Price calculation
  const customDimensions =
    selectedSize === 'Custom Size'
      ? { length: customLength, width: customWidth, thickness: customThickness }
      : undefined;

  const currentThickness =
    selectedSize === 'Custom Size' ? customThickness : selectedThickness;

  const pricing = calculateMattressPrice(
    product,
    selectedSize,
    currentThickness,
    customDimensions
  );

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = comparedProducts.includes(product.id);

  // Filter approved reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.isApproved
  );

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim().length === 6) {
      if (['500', '560', '600', '400', '110'].some((prefix) => pincodeInput.startsWith(prefix))) {
        setPincodeStatus(`Fast Delivery Available! Expected within 2-4 business days.`);
      } else {
        setPincodeStatus(`Standard Factory Freight Delivery Available within 5-7 business days.`);
      }
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian postal code.');
    }
  };

  const handleAddToCart = () => {
    const dimensionsMap: Record<MattressStandardSize, { length: number; width: number; thickness: number }> = {
      Single: { length: 72, width: 36, thickness: currentThickness },
      Twin: { length: 75, width: 39, thickness: currentThickness },
      Double: { length: 75, width: 54, thickness: currentThickness },
      Queen: { length: 78, width: 60, thickness: currentThickness },
      King: { length: 78, width: 72, thickness: currentThickness },
      'Custom Size': { length: customLength, width: customWidth, thickness: customThickness },
    };

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      category: product.category,
      size: selectedSize,
      dimensions: dimensionsMap[selectedSize],
      thickness: currentThickness,
      quantity,
      unitPrice: pricing.finalPrice,
      total: pricing.finalPrice * quantity,
      isCustom: selectedSize === 'Custom Size',
    });

    onClose();
    onOpenCart();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle || !newReviewComment) return;
    addReview({
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      customerName: newReviewAuthor || 'Verified Customer',
      customerEmail: currentCustomer?.email || 'customer@example.com',
      rating: newReviewRating,
      title: newReviewTitle,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
      isApproved: true,
      verifiedPurchase: true,
    });
    setReviewSubmittedMsg(true);
    setShowReviewForm(false);
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Top Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#EFECE6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
              {product.category}
            </span>
            <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
            <span className="text-xs text-[#78716C] font-mono">SKU: {product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#1E1E1E] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 lg:p-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4F1EC] border border-[#E8E3DC] relative">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-semibold text-[#1E1E1E]">
                  {product.discountPercent}% OFF
                </div>
              </div>

              {/* Thumbnails if multiple */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#1E1E1E]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Mattress Quality Score Card */}
              <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-2">
                  <h4 className="text-xs uppercase font-semibold tracking-wider text-[#1E1E1E]">
                    Mattress Quality &amp; Comfort Metrics
                  </h4>
                  <span className="text-[11px] text-[#78716C]">Verified Factory Tests</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#524E48]">Overall Quality:</span>
                    <RatingStars rating={product.ratings.quality} size={12} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#524E48]">Comfort Feel:</span>
                    <RatingStars rating={product.ratings.comfort} size={12} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#524E48]">Spinal Support:</span>
                    <RatingStars rating={product.ratings.support} size={12} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#524E48]">Durability:</span>
                    <RatingStars rating={product.ratings.durability} size={12} />
                  </div>
                  <div className="flex items-center justify-between col-span-2 pt-1 border-t border-[#E8E3DC]/60">
                    <span className="text-[#524E48]">Value for Money:</span>
                    <RatingStars rating={product.ratings.value} size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Configurator & Purchase Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#66615C] mt-2 leading-relaxed">
                  {product.tagline}
                </p>

                <div className="flex items-center gap-3 mt-3 text-xs text-[#66615C]">
                  <RatingStars rating={product.ratings.quality} size={14} showScore />
                  <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
                  <span>{product.reviewsCount} customer reviews</span>
                  <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
                  <span className="text-emerald-700 font-medium">In Stock ({product.stock} units ready)</span>
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4.5 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#1E1E1E] font-tabular">
                      {settings.currencySymbol}{pricing.finalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-[#9E9790] line-through font-tabular">
                      {settings.currencySymbol}{pricing.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      Save {settings.currencySymbol}{pricing.discountAmount.toLocaleString()} ({product.discountPercent}%)
                    </span>
                  </div>
                  <span className="text-xs text-[#78716C] mt-1 block">
                    Inclusive of all taxes ({settings.gstRatePercent}% GST) · Free direct factory shipping
                  </span>
                </div>
              </div>

              {/* Standard Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                    Select Mattress Size
                  </label>
                  <span className="text-xs text-[#78716C]">
                    Selected: <strong className="text-[#1E1E1E]">{selectedSize}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {product.standardSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-xs'
                          : 'border-[#E2DDD5] bg-white text-[#3C3836] hover:border-[#1E1E1E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Size Configurator Fields */}
              {selectedSize === 'Custom Size' && (
                <div className="bg-[#F8F5EE] border border-[#E2DDD5] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1E1E1E]">
                    <Layers size={15} className="text-[#B88E2F]" />
                    <span>Enter Custom Bed Dimensions (Inches)</span>
                  </div>
                  <p className="text-[11px] text-[#66615C]">
                    Calculated using factory volumetric rule ({settings.currencySymbol}{settings.customRatePerCubicInch}/in³). Tailored on our CNC wire cutter.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-[#66615C] block mb-1">
                        Length (in)
                      </label>
                      <input
                        type="number"
                        min={48}
                        max={96}
                        value={customLength}
                        onChange={(e) => setCustomLength(Math.max(48, Math.min(96, Number(e.target.value) || 78)))}
                        className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular font-semibold focus:outline-[#1E1E1E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#66615C] block mb-1">
                        Width (in)
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={84}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Math.max(30, Math.min(84, Number(e.target.value) || 60)))}
                        className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular font-semibold focus:outline-[#1E1E1E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#66615C] block mb-1">
                        Thickness (in)
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={14}
                        value={customThickness}
                        onChange={(e) => setCustomThickness(Math.max(4, Math.min(14, Number(e.target.value) || 8)))}
                        className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular font-semibold focus:outline-[#1E1E1E]"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#78716C] flex items-center justify-between pt-2 border-t border-[#E8E3DC]">
                    <span>Custom Volume: {(customLength * customWidth * customThickness).toLocaleString()} cu. in.</span>
                    <span className="font-semibold text-[#1E1E1E]">Tolerance: ±0.25 inch</span>
                  </div>
                </div>
              )}

              {/* Thickness Selector (for standard sizes) */}
              {selectedSize !== 'Custom Size' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                      Select Thickness
                    </label>
                    <span className="text-xs text-[#78716C]">
                      Height: <strong className="text-[#1E1E1E]">{selectedThickness} Inches</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {product.thicknessOptions.map((thick) => (
                      <button
                        key={thick}
                        onClick={() => setSelectedThickness(thick)}
                        className={`py-2 px-4 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          selectedThickness === thick
                            ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                            : 'border-[#E2DDD5] bg-white text-[#3C3836] hover:border-[#1E1E1E]'
                        }`}
                      >
                        {thick}" Inch
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag CTA */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-[#D5CFC9] rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#524E48] hover:bg-[#FAF8F5] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-tabular text-[#1E1E1E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#524E48] hover:bg-[#FAF8F5] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer text-center"
                >
                  Add to Cart · {settings.currencySymbol}{(pricing.finalPrice * quantity).toLocaleString()}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-[#D5CFC9] bg-white text-[#4A4540] hover:bg-[#FAF8F5]'
                  }`}
                  title={isWishlisted ? 'Saved' : 'Wishlist'}
                >
                  <Heart size={18} className={isWishlisted ? 'fill-rose-600' : ''} />
                </button>
              </div>

              {/* Pincode & Delivery Checker */}
              <div className="pt-4 border-t border-[#EFECE6]">
                <form onSubmit={handleCheckDelivery} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin size={15} className="absolute left-3 top-3 text-[#8C7A6B]" />
                    <input
                      type="text"
                      placeholder="Check delivery pincode (e.g. 500081)"
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value)}
                      maxLength={6}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D5CFC9] rounded-xl focus:outline-[#1E1E1E] font-tabular"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 text-xs font-semibold bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#D5CFC9] rounded-xl text-[#1E1E1E] transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus && (
                  <p className="text-xs text-[#524E48] mt-2 flex items-center gap-1.5">
                    <Truck size={14} className="text-emerald-700 shrink-0" />
                    <span>{pincodeStatus}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Full Specifications Section */}
          <div className="pt-8 border-t border-[#E8E3DC] space-y-6">
            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E]">
              Technical Specifications &amp; Material Architecture
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-4 space-y-2">
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Core Material Architecture:</span>
                  <span className="font-semibold text-[#1E1E1E] text-right">{product.material}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Foam Density Specification:</span>
                  <span className="font-semibold text-[#1E1E1E] text-right">{product.foamDensity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Foam Formulation:</span>
                  <span className="font-semibold text-[#1E1E1E] text-right">{product.foamType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Spring / Innerspring Matrix:</span>
                  <span className="font-semibold text-[#1E1E1E] text-right">{product.springType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#66615C]">Cover &amp; Quilting Fabric:</span>
                  <span className="font-semibold text-[#1E1E1E] text-right">{product.coverMaterial}</span>
                </div>
              </div>

              <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-4 space-y-2">
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Firmness Profile:</span>
                  <span className="font-semibold text-[#1E1E1E]">{product.firmness}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Max Weight Capacity:</span>
                  <span className="font-semibold text-[#1E1E1E] font-tabular">{product.weightCapacityKg} kg per sleeper</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Factory Warranty Coverage:</span>
                  <span className="font-semibold text-[#1E1E1E]">{product.warrantyYears} Years Sag-Proof Guarantee</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Expected Lifespan:</span>
                  <span className="font-semibold text-[#1E1E1E] font-tabular">{product.expectedLifespanYears} Years</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#66615C]">Home Sleep Trial:</span>
                  <span className="font-semibold text-[#1E1E1E]">{product.trialPeriodDays} Nights Risk-Free</span>
                </div>
              </div>
            </div>

            {/* Certifications row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
                Audited Certifications:
              </span>
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs bg-[#FAF8F5] border border-[#E2DDD5] text-[#3C3836] px-3 py-1 rounded-lg font-medium"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>

            {/* Care instructions */}
            <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl p-4 text-xs space-y-1.5">
              <span className="font-semibold text-[#1E1E1E] block mb-1">
                Care Instructions &amp; Maintenance:
              </span>
              {product.careInstructions.map((instr, idx) => (
                <p key={idx} className="text-[#66615C]">
                  · {instr}
                </p>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-[#E8E3DC] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E]">
                  Customer Reviews ({productReviews.length})
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Real feedback from verified purchasers.
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="py-2 px-4 text-xs font-semibold text-[#1E1E1E] bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#D5CFC9] rounded-xl transition-colors cursor-pointer"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {reviewSubmittedMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl">
                Thank you! Your verified review has been recorded.
              </div>
            )}

            {/* New Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-5 space-y-3.5">
                <h4 className="text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider">
                  Review this Mattress
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#524E48]">Your Rating:</span>
                  <div className="flex gap-1 text-[#B88E2F]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={star <= newReviewRating ? 'fill-[#B88E2F]' : 'text-[#D5CFC9]'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#66615C] block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#66615C] block mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Best back support mattress"
                      className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#66615C] block mb-1">Detailed Experience</label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe comfort, firmness, temperature, and delivery..."
                    className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#1E1E1E] text-white text-xs font-semibold rounded-xl hover:bg-[#33312E] transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <p className="text-xs text-[#8C7A6B]">
                  No reviews posted yet for this model. Be the first to share your sleep experience!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-4 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rev.rating} size={12} />
                        <span className="font-semibold text-[#1E1E1E]">{rev.title}</span>
                      </div>
                      <span className="text-[11px] text-[#8C7A6B] font-tabular">{rev.date}</span>
                    </div>

                    <p className="text-[#524E48] leading-relaxed pt-1">{rev.comment}</p>

                    <div className="flex items-center gap-2 text-[11px] text-[#78716C] pt-1">
                      <span>{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <>
                          <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
                          <span className="text-emerald-700 font-medium">✓ Verified DreamNest Buyer</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
