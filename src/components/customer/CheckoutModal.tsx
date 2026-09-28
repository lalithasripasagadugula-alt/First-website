import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Truck,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const {
    cart,
    currentCustomer,
    appliedCoupon,
    placeOrder,
    settings,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Customer details
  const [fullName, setFullName] = useState(currentCustomer?.name || 'Rahul Sharma');
  const [email, setEmail] = useState(currentCustomer?.email || 'rahul.sharma@example.com');
  const [mobile, setMobile] = useState(currentCustomer?.mobile || '9876543210');

  // Step 2: Address
  const defaultAddr = currentCustomer?.addresses[0];
  const [addressLine, setAddressLine] = useState(defaultAddr?.line1 || 'Apt 402, Sunshine Heights, Madhapur');
  const [city, setCity] = useState(defaultAddr?.city || 'Hyderabad');
  const [state, setState] = useState(defaultAddr?.state || 'Telangana');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '500081');

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [cardHolder, setCardHolder] = useState('Rahul Sharma');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Completed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

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

  const deliveryCharge =
    subtotal >= settings.freeShippingThreshold || subtotal === 0
      ? 0
      : settings.standardShippingFee;

  const gstAmount = Math.round((subtotal * settings.gstRatePercent) / (100 + settings.gstRatePercent));
  const finalTotal = Math.max(0, subtotal - discount + deliveryCharge);

  const handleFinalSubmit = () => {
    const order = placeOrder({
      customerName: fullName,
      customerEmail: email,
      customerMobile: mobile,
      shippingAddress: {
        id: `addr-${Date.now()}`,
        fullName,
        mobile,
        line1: addressLine,
        city,
        state,
        pincode,
        isDefault: true,
      },
      items: [...cart],
      subtotal,
      deliveryCharge,
      discount,
      tax: gstAmount,
      total: finalTotal,
      paymentMethod,
    });

    setConfirmedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EFECE6] bg-[#FAF9F5] flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1E1E1E]">
              {confirmedOrder ? 'Order Confirmed' : 'Checkout & Express Delivery'}
            </h2>
            {!confirmedOrder && (
              <div className="flex items-center gap-2 text-xs text-[#78716C] mt-1 font-medium">
                <span className={step >= 1 ? 'text-[#1E1E1E] font-semibold' : ''}>1. Contact</span>
                <span>→</span>
                <span className={step >= 2 ? 'text-[#1E1E1E] font-semibold' : ''}>2. Address</span>
                <span>→</span>
                <span className={step >= 3 ? 'text-[#1E1E1E] font-semibold' : ''}>3. Summary</span>
                <span>→</span>
                <span className={step >= 4 ? 'text-[#1E1E1E] font-semibold' : ''}>4. Payment</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E8E3DC] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Confirmed Order State */}
          {confirmedOrder ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle size={32} />
              </div>

              <div>
                <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
                  Payment Verified · Ready for Manufacturing
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-1">
                  Thank You, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-[#66615C] mt-1">
                  Your order has been assigned to our Cherlapally production plant.
                </p>
              </div>

              {/* Order summary badge */}
              <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-5 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Order ID:</span>
                  <span className="font-mono font-bold text-[#1E1E1E]">#{confirmedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Expected Delivery:</span>
                  <span className="font-semibold text-[#1E1E1E]">{confirmedOrder.expectedDeliveryDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Payment Method:</span>
                  <span className="font-medium text-[#1E1E1E]">{confirmedOrder.paymentMethod} (Verified)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EFECE6]">
                  <span className="text-[#66615C]">Shipping Destination:</span>
                  <span className="font-medium text-[#1E1E1E] text-right">
                    {confirmedOrder.shippingAddress.line1}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.pincode}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold text-[#1E1E1E]">
                  <span>Total Paid:</span>
                  <span className="font-tabular">{settings.currencySymbol}{confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOrderCompleted(confirmedOrder);
                  }}
                  className="py-3 px-6 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Track in Customer Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Customer Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#1E1E1E] uppercase tracking-wider">
                    Step 1: Customer Contact
                  </h3>
                  <div>
                    <label className="text-xs text-[#524E48] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#524E48] block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#524E48] block mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#1E1E1E] uppercase tracking-wider">
                    Step 2: Delivery Address
                  </h3>
                  <div>
                    <label className="text-xs text-[#524E48] block mb-1">Street / House / Apartment</label>
                    <input
                      type="text"
                      required
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-[#524E48] block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#524E48] block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#524E48] block mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-[#1E1E1E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Product Summary */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#1E1E1E] uppercase tracking-wider">
                    Step 3: Review Order Items
                  </h3>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl p-3 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-semibold text-[#1E1E1E]">{item.productName}</div>
                            <div className="text-[11px] text-[#78716C]">
                              {item.size} · {item.thickness}" · Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-[#1E1E1E] font-tabular">
                          {settings.currencySymbol}{item.total.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-4 text-xs space-y-1.5 text-[#524E48]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-tabular font-semibold text-[#1E1E1E]">
                        {settings.currencySymbol}{subtotal.toLocaleString()}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Coupon Discount:</span>
                        <span className="font-tabular">-{settings.currencySymbol}{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Freight:</span>
                      <span className="text-emerald-700 font-semibold font-tabular">
                        {deliveryCharge === 0 ? 'FREE' : `${settings.currencySymbol}${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#1E1E1E] pt-2 border-t border-[#EFECE6]">
                      <span>Final Total:</span>
                      <span className="font-tabular">{settings.currencySymbol}{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Selection */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#1E1E1E] uppercase tracking-wider">
                    Step 4: Select Payment Method
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'UPI'
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-xs'
                          : 'border-[#E2DDD5] bg-[#FAF8F5] text-[#3C3836]'
                      }`}
                    >
                      <Smartphone size={18} className="mx-auto mb-1" />
                      <span className="text-xs font-semibold block">UPI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'Card'
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-xs'
                          : 'border-[#E2DDD5] bg-[#FAF8F5] text-[#3C3836]'
                      }`}
                    >
                      <CreditCard size={18} className="mx-auto mb-1" />
                      <span className="text-xs font-semibold block">Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NetBanking')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'NetBanking'
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-xs'
                          : 'border-[#E2DDD5] bg-[#FAF8F5] text-[#3C3836]'
                      }`}
                    >
                      <Building2 size={18} className="mx-auto mb-1" />
                      <span className="text-xs font-semibold block">NetBanking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        paymentMethod === 'COD'
                          ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-xs'
                          : 'border-[#E2DDD5] bg-[#FAF8F5] text-[#3C3836]'
                      }`}
                    >
                      <Banknote size={18} className="mx-auto mb-1" />
                      <span className="text-xs font-semibold block">Cash on Delivery</span>
                    </button>
                  </div>

                  {/* Payment Subfields (mock gateway ready) */}
                  <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4 text-xs space-y-3">
                    {paymentMethod === 'UPI' && (
                      <div>
                        <label className="text-[#524E48] block mb-1">Enter UPI VPA (Google Pay / PhonePe / Paytm)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okhdfcbank"
                          className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono focus:outline-[#1E1E1E]"
                        />
                      </div>
                    )}

                    {paymentMethod === 'Card' && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[#524E48] block mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[#524E48] block mb-1">Card Number (Tokenized Preview)</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono focus:outline-[#1E1E1E]"
                            />
                          </div>
                          <div>
                            <label className="text-[#524E48] block mb-1">Expiry &amp; CVV</label>
                            <input
                              type="text"
                              readOnly
                              value="10/29 · •••"
                              className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono"
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-[#78716C]">
                          * PCI-DSS 256-bit encrypted. Raw card credentials are never stored on DreamNest servers.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'NetBanking' && (
                      <div>
                        <label className="text-[#524E48] block mb-1">Choose Bank</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                        >
                          <option>HDFC Bank</option>
                          <option>State Bank of India</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}

                    {paymentMethod === 'COD' && (
                      <p className="text-[#524E48] leading-relaxed">
                        Pay ₹{finalTotal.toLocaleString()} in cash or via delivery executive's QR code upon delivery. A verification call will be placed prior to dispatch from Cherlapally.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="py-2.5 px-4 text-xs font-semibold text-[#524E48] hover:text-[#1E1E1E] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as 2 | 3 | 4)}
                    className="py-3 px-6 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    Continue to {step === 1 ? 'Address' : step === 2 ? 'Summary' : 'Payment'}
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="py-3 px-6 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Confirm Order &amp; Pay {settings.currencySymbol}{finalTotal.toLocaleString()}</span>
                    <ShieldCheck size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
