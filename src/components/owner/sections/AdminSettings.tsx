import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CompanySettings } from '../../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetAllDataToDemo } = useApp();

  const [form, setForm] = useState<CompanySettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetAllDataToDemo();
    setResetConfirmOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            System Configuration &amp; Business Rules
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Enterprise Admin Settings
          </h1>
        </div>

        <button
          onClick={() => setResetConfirmOpen(true)}
          className="py-2 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>Settings saved successfully. All changes are active across store and ERP.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E] border-b border-[#F2EFE9] pb-3">
            Company &amp; Manufacturing Entity Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Brand / Trading Name</label>
              <input
                type="text"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
              />
            </div>
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Brand Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">GSTIN Number</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono focus:outline-[#1E1E1E]"
              />
            </div>
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">PAN Identifier</label>
              <input
                type="text"
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono focus:outline-[#1E1E1E]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#524E48] block mb-1 font-semibold">Factory / Registered Plant Address</label>
            <input
              type="text"
              value={form.businessAddress}
              onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
              />
            </div>
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
              />
            </div>
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Pincode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono focus:outline-[#1E1E1E]"
              />
            </div>
          </div>
        </div>

        {/* Commercial & Volumetric Custom Pricing Rules */}
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E] border-b border-[#F2EFE9] pb-3">
            Pricing, Tax &amp; Custom Volumetric Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">
                Custom Bed Base Rate (₹/cu. inch)
              </label>
              <input
                type="number"
                step="0.05"
                value={form.customRatePerCubicInch}
                onChange={(e) => setForm({ ...form, customRatePerCubicInch: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
              />
              <span className="text-[10px] text-[#78716C] mt-1 block">
                Length × Width × Height × Rate
              </span>
            </div>

            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Standard GST Rate (%)</label>
              <input
                type="number"
                value={form.gstRatePercent}
                onChange={(e) => setForm({ ...form, gstRatePercent: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
              />
            </div>

            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Standard Delivery Freight (₹)</label>
              <input
                type="number"
                value={form.standardShippingFee}
                onChange={(e) => setForm({ ...form, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
              />
            </div>

            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Home Sleep Trial (Nights)</label>
              <input
                type="number"
                value={form.returnPolicyDays}
                onChange={(e) => setForm({ ...form, returnPolicyDays: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
              />
            </div>

            <div>
              <label className="text-[#524E48] block mb-1 font-semibold">Default Warranty (Years)</label>
              <input
                type="number"
                value={form.warrantyPolicyYears}
                onChange={(e) => setForm({ ...form, warrantyPolicyYears: Number(e.target.value) })}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-8 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
        >
          <Save size={15} />
          <span>Save Admin Settings</span>
        </button>
      </form>

      {/* Confirmation Dialog for Reset */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <ShieldAlert size={22} />
            </div>

            <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
              Reset Demo Dataset?
            </h3>
            <p className="text-xs text-[#524E48] leading-relaxed">
              This will restore all 10 mattress models, 10 raw materials, 5 suppliers, initial order statuses, and default procurement weights.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-[#EFECE6] text-xs font-semibold rounded-xl text-[#524E48]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-xs font-semibold rounded-xl text-white"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
