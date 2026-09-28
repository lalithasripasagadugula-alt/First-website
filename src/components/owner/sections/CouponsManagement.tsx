import React, { useState } from 'react';
import { Tag, Plus, Check, X, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Coupon } from '../../../types';

export const CouponsManagement: React.FC = () => {
  const { coupons, addCoupon, toggleCouponStatus, settings } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [value, setValue] = useState(1000);
  const [minOrderValue, setMinOrderValue] = useState(15000);
  const [endDate, setEndDate] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    addCoupon({
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      value,
      minOrderValue,
      startDate: new Date().toISOString().split('T')[0],
      endDate,
      isActive: true,
      usageCount: 0,
      usageLimit: 500,
    });

    setShowModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Promotions &amp; Customer Acquisition
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Offers &amp; Coupon Codes ({coupons.length})
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4">Min. Cart Value</th>
                <th className="py-3.5 px-4">Times Redeemed</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sm text-[#1E1E1E]">
                    {c.code}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#1E1E1E] font-tabular">
                    {c.discountType === 'flat' ? `${settings.currencySymbol}${c.value} Flat Off` : `${c.value}% Off`}
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#524E48]">
                    {settings.currencySymbol}{c.minOrderValue.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#524E48]">
                    {c.usageCount} / {c.usageLimit}
                  </td>

                  <td className="py-3 px-4 text-[#78716C] font-tabular">
                    Until {c.endDate}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleCouponStatus(c.id)}
                      className="py-1 px-3 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#D5CFC9] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mb-1">
              Create Campaign Coupon
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              Configured codes immediately apply at checkout when customer requirements are met.
            </p>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-mono uppercase text-xs focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                  >
                    <option value="flat">Flat Cash (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Value</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Minimum Order Threshold (₹)</label>
                <input
                  type="number"
                  required
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-[#EFECE6] rounded-xl font-semibold text-[#524E48]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1E1E1E] hover:bg-[#33312E] text-white rounded-xl font-semibold"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
