import React, { useState } from 'react';
import { Calculator, DollarSign, Layers, PieChart, RefreshCw, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MattressStandardSize } from '../../../types';

export const CostCalculator: React.FC = () => {
  const { products, settings } = useApp();

  const [selectedModel, setSelectedModel] = useState<string>(products[0]?.name || 'DreamNest OrthoPro');
  const [size, setSize] = useState<MattressStandardSize>('Queen');
  const [thickness, setThickness] = useState<number>(8);

  // Component Cost Inputs (Configurable in real time)
  const [foamWeightKg, setFoamWeightKg] = useState<number>(44);
  const [foamRatePerKg, setFoamRatePerKg] = useState<number>(185);

  const [hasSprings, setHasSprings] = useState<boolean>(false);
  const [springUnitCost, setSpringUnitCost] = useState<number>(3450);

  const [fabricMeters, setFabricMeters] = useState<number>(5.5);
  const [fabricRatePerMeter, setFabricRatePerMeter] = useState<number>(180);

  const [adhesiveCost, setAdhesiveCost] = useState<number>(504);
  const [zipperBorderCost, setZipperBorderCost] = useState<number>(350);
  const [laborCost, setLaborCost] = useState<number>(950);
  const [packagingCost, setPackagingCost] = useState<number>(450);
  const [freightCost, setFreightCost] = useState<number>(450);
  const [factoryOverheadCost, setFactoryOverheadCost] = useState<number>(400);

  // Commercial Pricing Target
  const [retailSellingPrice, setRetailSellingPrice] = useState<number>(18699);
  const [wholesaleMarkupPercent, setWholesaleMarkupPercent] = useState<number>(25);

  // Sub-totals
  const totalFoamCost = Math.round(foamWeightKg * foamRatePerKg);
  const totalSpringCost = hasSprings ? springUnitCost : 0;
  const totalFabricCost = Math.round(fabricMeters * fabricRatePerMeter);

  const directMaterialCost = totalFoamCost + totalSpringCost + totalFabricCost + adhesiveCost + zipperBorderCost;
  const conversionCost = laborCost + packagingCost + freightCost + factoryOverheadCost;

  const totalManufacturingCost = directMaterialCost + conversionCost;
  const wholesalePrice = Math.round(totalManufacturingCost * (1 + wholesaleMarkupPercent / 100));

  const grossProfit = retailSellingPrice - totalManufacturingCost;
  const grossMarginPercent = retailSellingPrice > 0 ? Math.round((grossProfit / retailSellingPrice) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Bill of Materials (BOM) &amp; Margin Engineering
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Manufacturing Cost &amp; Profit Calculator
          </h1>
        </div>

        <button
          onClick={() => {
            // Reset to default baseline
            setFoamWeightKg(44);
            setFoamRatePerKg(185);
            setFabricMeters(5.5);
            setFabricRatePerMeter(180);
            setLaborCost(950);
            setPackagingCost(450);
            setFreightCost(450);
            setFactoryOverheadCost(400);
            setRetailSellingPrice(18699);
          }}
          className="text-xs text-[#78716C] hover:text-[#1E1E1E] flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Reset to Cherlapally Baseline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-7 bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
              1. Mattress Model &amp; Sizing Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1">Mattress Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1">Standard Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as MattressStandardSize)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                >
                  <option>Single</option>
                  <option>Twin</option>
                  <option>Double</option>
                  <option>Queen</option>
                  <option>King</option>
                  <option>Custom Size</option>
                </select>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1">Thickness (Inches)</label>
                <select
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                >
                  <option value={5}>5" Profile</option>
                  <option value={6}>6" Profile</option>
                  <option value={8}>8" Profile</option>
                  <option value={10}>10" Profile</option>
                  <option value={12}>12" Profile</option>
                </select>
              </div>
            </div>
          </div>

          {/* Raw Material Consumption Inputs */}
          <div className="pt-4 border-t border-[#F2EFE9] space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
              2. Raw Material Consumption
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1">Total Foam Weight (kg)</label>
                <input
                  type="number"
                  value={foamWeightKg}
                  onChange={(e) => setFoamWeightKg(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-[#524E48] block mb-1">Blended Foam Rate (₹/kg)</label>
                <input
                  type="number"
                  value={foamRatePerKg}
                  onChange={(e) => setFoamRatePerKg(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
            </div>

            {/* Innerspring Unit Toggle */}
            <div className="p-3 bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#1E1E1E]">
                <input
                  type="checkbox"
                  checked={hasSprings}
                  onChange={(e) => setHasSprings(e.target.checked)}
                  className="accent-[#1E1E1E] rounded"
                />
                <span>Include Pocket Spring or Bonnell Unit</span>
              </label>

              {hasSprings && (
                <div>
                  <label className="text-[#524E48] block mb-1">Spring Innerspring Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={springUnitCost}
                    onChange={(e) => setSpringUnitCost(Number(e.target.value))}
                    className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1">Quilting Fabric (Meters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fabricMeters}
                  onChange={(e) => setFabricMeters(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-[#524E48] block mb-1">Fabric Rate (₹/meter)</label>
                <input
                  type="number"
                  value={fabricRatePerMeter}
                  onChange={(e) => setFabricRatePerMeter(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1">Hot-Melt Adhesive Cost (₹)</label>
                <input
                  type="number"
                  value={adhesiveCost}
                  onChange={(e) => setAdhesiveCost(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-[#524E48] block mb-1">Tape-Edge &amp; Zipper Hardware (₹)</label>
                <input
                  type="number"
                  value={zipperBorderCost}
                  onChange={(e) => setZipperBorderCost(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
            </div>
          </div>

          {/* Labor & Operational Overheads */}
          <div className="pt-4 border-t border-[#F2EFE9] space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
              3. Factory Labor, Packaging &amp; Freight
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1">Assembly Labor (₹)</label>
                <input
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-[#524E48] block mb-1">Packaging (₹)</label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-[#524E48] block mb-1">Freight (₹)</label>
                <input
                  type="number"
                  value={freightCost}
                  onChange={(e) => setFreightCost(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-[#524E48] block mb-1">Overhead (₹)</label>
                <input
                  type="number"
                  value={factoryOverheadCost}
                  onChange={(e) => setFactoryOverheadCost(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Profit Margin Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 sticky top-4">
            <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E] border-b border-[#F2EFE9] pb-3">
              Cost &amp; Profitability Analysis
            </h3>

            {/* Breakdown List */}
            <div className="space-y-2 text-xs text-[#524E48]">
              <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                <span>Foam Substrate Cost:</span>
                <span className="font-tabular font-semibold text-[#1E1E1E]">
                  {settings.currencySymbol}{totalFoamCost.toLocaleString()}
                </span>
              </div>

              {hasSprings && (
                <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                  <span>Pocket / Bonnell Coils:</span>
                  <span className="font-tabular font-semibold text-[#1E1E1E]">
                    {settings.currencySymbol}{totalSpringCost.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                <span>Quilted Top Fabric:</span>
                <span className="font-tabular font-semibold text-[#1E1E1E]">
                  {settings.currencySymbol}{totalFabricCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                <span>Adhesives &amp; Hardware:</span>
                <span className="font-tabular font-semibold text-[#1E1E1E]">
                  {settings.currencySymbol}{(adhesiveCost + zipperBorderCost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#F2EFE9]">
                <span>Factory Labor &amp; Overheads:</span>
                <span className="font-tabular font-semibold text-[#1E1E1E]">
                  {settings.currencySymbol}{conversionCost.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between pt-2 text-sm font-bold text-[#1E1E1E]">
                <span>Total Manufacturing Cost (COGS):</span>
                <span className="font-tabular text-base">
                  {settings.currencySymbol}{totalManufacturingCost.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Commercial Pricing Target */}
            <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4.5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1E1E1E] block mb-1">
                  Target Retail Selling Price (₹)
                </label>
                <input
                  type="number"
                  value={retailSellingPrice}
                  onChange={(e) => setRetailSellingPrice(Number(e.target.value))}
                  className="w-full bg-white border border-[#D5CFC9] rounded-xl px-3.5 py-2 text-base font-bold font-tabular focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="pt-2 border-t border-[#EFECE6] flex justify-between text-xs">
                <span className="text-[#524E48]">Wholesale Dealer Price (+{wholesaleMarkupPercent}%):</span>
                <strong className="text-[#1E1E1E] font-tabular">
                  {settings.currencySymbol}{wholesalePrice.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Profit & Margin Output Card */}
            <div className="p-4.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Gross Profit per Unit
                </span>
                <span className="font-serif-display text-2xl font-bold text-emerald-900 font-tabular">
                  +{settings.currencySymbol}{grossProfit.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60">
                <span className="text-emerald-800">Gross Margin Percentage:</span>
                <strong className="text-base font-bold text-emerald-900 font-tabular">
                  {grossMarginPercent}%
                </strong>
              </div>
            </div>

            <p className="text-[11px] text-[#78716C] leading-relaxed">
              * Note: Operating net margin accounts for customer shipping, payment gateway processing (~1.8%), and 10-year warranty provision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
