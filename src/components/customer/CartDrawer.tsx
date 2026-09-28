import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    settings,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      discount = appliedCoupon.value;
    } else {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    }
  }

  // Delivery charge rule
  const deliveryCharge =
    subtotal >= settings.freeShippingThreshold || subtotal === 0
      ? 0
      : settings.standardShippingFee;

  // Tax calculation (inclusive or added - let's treat subtotal as inclusive of GST, but show tax breakdown for transparent accounting)
  const gstAmount = Math.round((subtotal * settings.gstRatePercent) / (100 + settings.gstRatePercent));
  const finalTotal = Math.max(0, subtotal - discount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    const result = applyCouponCode(couponInput);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponInput('');
    } else {
      setCouponError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF9F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E0D8]">
        {/* Top Header */}
        <div className="p-5 border-b border-[#E8E3DC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#1E1E1E]" />
            <h2 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
              Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EFECE6] flex items-center justify-center mx-auto text-[#78716C]">
                <ShoppingBag size={20} />
              </div>
              <p className="text-sm font-semibold text-[#1E1E1E]">Your bag is currently empty</p>
              <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                Explore our handcrafted orthopedic, memory foam, and natural latex collections.
              </p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="bg-white border border-[#E8E3DC] rounded-2xl p-4 flex gap-3.5 shadow-xs"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F4F1EC] shrink-0 border border-[#EFECE6]">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-[#1E1E1E] line-clamp-1">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-[#9E9790] hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#78716C] mt-0.5 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#1E1E1E]">{item.size}</span>
                        <span aria-hidden="true" className="text-[#D5CFC9]">·</span>
                        <span>{item.thickness}" Thick</span>
                      </div>
                      {item.isCustom && (
                        <div className="text-[#B88E2F] font-mono text-[10px]">
                          Dimensions: {item.dimensions.length}"L × {item.dimensions.width}"W × {item.dimensions.thickness}"H
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F2EFE9]">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#E2DDD5] rounded-lg bg-[#FAF8F5] px-1">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#524E48] hover:text-[#1E1E1E] cursor-pointer"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-tabular text-[#1E1E1E]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#524E48] hover:text-[#1E1E1E] cursor-pointer"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#1E1E1E] font-tabular">
                      {settings.currencySymbol}{item.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="bg-white border border-[#E8E3DC] rounded-2xl p-4 space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A6B] block">
                Have a Promo Code?
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag size={13} />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline cursor-pointer font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. FESTIVE1000)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs uppercase font-mono focus:outline-[#1E1E1E]"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3.5 bg-[#1E1E1E] text-white text-xs font-semibold rounded-xl hover:bg-[#33312E] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-700 mt-1">{couponSuccess}</p>}
            </div>
          )}
        </div>

        {/* Bottom Order Summary & Proceed Button */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E8E3DC] space-y-3">
            <div className="space-y-1.5 text-xs text-[#524E48]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-tabular font-semibold text-[#1E1E1E]">
                  {settings.currencySymbol}{subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount:</span>
                  <span className="font-tabular">
                    -{settings.currencySymbol}{discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Factory Doorstep Freight:</span>
                <span className="font-tabular">
                  {deliveryCharge === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    `${settings.currencySymbol}${deliveryCharge.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-[#78716C] pt-1">
                <span>Inclusive of GST ({settings.gstRatePercent}%):</span>
                <span className="font-tabular">{settings.currencySymbol}{gstAmount.toLocaleString()}</span>
              </div>

              <div className="border-t border-[#EFECE6] pt-2 flex justify-between text-sm font-bold text-[#1E1E1E]">
                <span>Total Amount:</span>
                <span className="text-base font-tabular">
                  {settings.currencySymbol}{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-6 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </button>

            <p className="text-[10px] text-center text-[#8C7A6B]">
              100-Night Trial · 10-Year Sag-Proof Warranty · 100% Secure Checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
