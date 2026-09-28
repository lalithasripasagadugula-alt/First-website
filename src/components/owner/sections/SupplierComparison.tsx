import React, { useState } from 'react';
import { Scale, Sliders, CheckCircle2, AlertCircle, TrendingDown, Award, Zap, Info } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SupplierComparisonItem } from '../../../types';

export const SupplierComparison: React.FC = () => {
  const {
    supplierComparisons,
    procurementWeights,
    updateProcurementWeights,
    settings,
  } = useApp();

  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string>('HR Foam 40D (per kg)');
  const [sortCriterion, setSortCriterion] = useState<'overall' | 'landed' | 'price' | 'quality' | 'delivery'>('overall');

  // Distinct material groups
  const materialGroups = Array.from(
    new Set(supplierComparisons.map((c) => c.materialName))
  );

  const currentQuotes = supplierComparisons.filter(
    (c) => c.materialName === selectedMaterialGroup
  );

  // Calculate composite multi-attribute score for each supplier
  // Normalize each metric from 0 to 100
  const scoredQuotes = currentQuotes.map((item) => {
    // Landed cost scoring: lower is better
    const minLanded = Math.min(...currentQuotes.map((q) => q.totalLandedCost));
    const maxLanded = Math.max(...currentQuotes.map((q) => q.totalLandedCost));
    const landedScore = maxLanded === minLanded ? 100 : Math.round(100 - ((item.totalLandedCost - minLanded) / (maxLanded - minLanded)) * 60);

    // Delivery scoring: shorter lead time is better
    const minLead = Math.min(...currentQuotes.map((q) => q.leadTimeDays));
    const maxLead = Math.max(...currentQuotes.map((q) => q.leadTimeDays));
    const deliveryScore = maxLead === minLead ? 100 : Math.round(100 - ((item.leadTimeDays - minLead) / (maxLead - minLead)) * 50);

    // Composite weighted score
    const totalWeight =
      procurementWeights.priceWeight +
      procurementWeights.qualityWeight +
      procurementWeights.deliveryWeight +
      procurementWeights.reliabilityWeight;

    const compositeScore = Math.round(
      (landedScore * procurementWeights.priceWeight +
        item.qualityScore * procurementWeights.qualityWeight +
        deliveryScore * procurementWeights.deliveryWeight +
        item.reliabilityScore * procurementWeights.reliabilityWeight) /
        (totalWeight || 100)
    );

    // Generate objective rationale
    let rationale = '';
    if (item.totalLandedCost === minLanded && item.leadTimeDays === minLead) {
      rationale = `Unbeatable combination of lowest landed cost (${settings.currencySymbol}${item.totalLandedCost.toFixed(2)}) and fastest lead time (${item.leadTimeDays} days).`;
    } else if (item.totalLandedCost === minLanded) {
      rationale = `Lowest total landed cost (${settings.currencySymbol}${item.totalLandedCost.toFixed(2)}) including freight and GST.`;
    } else if (item.qualityScore >= 95) {
      rationale = `Superior grade ${item.qualityGrade} quality score (${item.qualityScore}/100) minimizes manufacturing batch defects.`;
    } else if (item.materialPrice < item.totalLandedCost * 0.8) {
      rationale = `Low factory gate quote (${settings.currencySymbol}${item.materialPrice}), but freight (${settings.currencySymbol}${item.transportCost}) increases final landed price.`;
    } else {
      rationale = `Balanced option with ${item.qualityScore}/100 quality and ${item.reliabilityScore}/100 delivery track record.`;
    }

    return {
      ...item,
      landedScore,
      deliveryScore,
      compositeScore,
      rationale,
    };
  });

  // Sort according to selection
  const sortedQuotes = [...scoredQuotes].sort((a, b) => {
    if (sortCriterion === 'overall') return b.compositeScore - a.compositeScore;
    if (sortCriterion === 'landed') return a.totalLandedCost - b.totalLandedCost;
    if (sortCriterion === 'price') return a.materialPrice - b.materialPrice;
    if (sortCriterion === 'quality') return b.qualityScore - a.qualityScore;
    if (sortCriterion === 'delivery') return a.leadTimeDays - b.leadTimeDays;
    return 0;
  });

  // Highlight metric winners
  const lowestLandedQuote = [...currentQuotes].sort((a, b) => a.totalLandedCost - b.totalLandedCost)[0];
  const highestQualityQuote = [...currentQuotes].sort((a, b) => b.qualityScore - a.qualityScore)[0];
  const fastestDeliveryQuote = [...currentQuotes].sort((a, b) => a.leadTimeDays - b.leadTimeDays)[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Smart Procurement Analysis &amp; Landed Cost Algorithm
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Supplier Price &amp; Landed Cost Comparison
          </h1>
        </div>

        {/* Material Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#524E48]">Select Material:</label>
          <select
            value={selectedMaterialGroup}
            onChange={(e) => setSelectedMaterialGroup(e.target.value)}
            className="py-2 px-3 bg-white border border-[#D5CFC9] rounded-xl text-xs font-semibold text-[#1E1E1E] focus:outline-[#1E1E1E]"
          >
            {materialGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C]">Lowest Landed Cost</span>
            <TrendingDown size={16} className="text-emerald-700" />
          </div>
          <div className="font-serif-display text-xl font-bold text-[#1E1E1E] mt-1">
            {lowestLandedQuote?.supplierName}
          </div>
          <span className="text-xs font-bold text-emerald-800 font-tabular mt-0.5 block">
            {settings.currencySymbol}{lowestLandedQuote?.totalLandedCost.toFixed(2)} landed
          </span>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C]">Highest Quality Rating</span>
            <Award size={16} className="text-[#B88E2F]" />
          </div>
          <div className="font-serif-display text-xl font-bold text-[#1E1E1E] mt-1">
            {highestQualityQuote?.supplierName}
          </div>
          <span className="text-xs font-bold text-[#1E1E1E] font-tabular mt-0.5 block">
            Quality Score: {highestQualityQuote?.qualityScore}/100 (Grade {highestQualityQuote?.qualityGrade})
          </span>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C]">Shortest Lead Time</span>
            <Zap size={16} className="text-blue-700" />
          </div>
          <div className="font-serif-display text-xl font-bold text-[#1E1E1E] mt-1">
            {fastestDeliveryQuote?.supplierName}
          </div>
          <span className="text-xs font-bold text-blue-800 font-tabular mt-0.5 block">
            {fastestDeliveryQuote?.leadTimeDays} business days (from {fastestDeliveryQuote?.location.split(',')[0]})
          </span>
        </div>
      </div>

      {/* Configurable Multi-Attribute Weighting Engine */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-[#8C7A6B]" />
            <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
              Configurable Procurement Scoring Weights
            </h3>
          </div>
          <span className="text-xs text-[#78716C]">
            Total Weight: {procurementWeights.priceWeight + procurementWeights.qualityWeight + procurementWeights.deliveryWeight + procurementWeights.reliabilityWeight}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#524E48] font-medium">Price / Landed Cost:</span>
              <strong className="text-[#1E1E1E] font-tabular">{procurementWeights.priceWeight}%</strong>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={procurementWeights.priceWeight}
              onChange={(e) =>
                updateProcurementWeights({
                  ...procurementWeights,
                  priceWeight: Number(e.target.value),
                })
              }
              className="w-full accent-[#1E1E1E]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#524E48] font-medium">Quality Specification:</span>
              <strong className="text-[#1E1E1E] font-tabular">{procurementWeights.qualityWeight}%</strong>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={procurementWeights.qualityWeight}
              onChange={(e) =>
                updateProcurementWeights({
                  ...procurementWeights,
                  qualityWeight: Number(e.target.value),
                })
              }
              className="w-full accent-[#1E1E1E]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#524E48] font-medium">Lead Time / Delivery:</span>
              <strong className="text-[#1E1E1E] font-tabular">{procurementWeights.deliveryWeight}%</strong>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              value={procurementWeights.deliveryWeight}
              onChange={(e) =>
                updateProcurementWeights({
                  ...procurementWeights,
                  deliveryWeight: Number(e.target.value),
                })
              }
              className="w-full accent-[#1E1E1E]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#524E48] font-medium">Supplier Reliability:</span>
              <strong className="text-[#1E1E1E] font-tabular">{procurementWeights.reliabilityWeight}%</strong>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              value={procurementWeights.reliabilityWeight}
              onChange={(e) =>
                updateProcurementWeights({
                  ...procurementWeights,
                  reliabilityWeight: Number(e.target.value),
                })
              }
              className="w-full accent-[#1E1E1E]"
            />
          </div>
        </div>

        {/* Sorting Buttons */}
        <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="text-[#78716C] font-medium">Sort Vendors By:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSortCriterion('overall')}
              className={`py-1 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortCriterion === 'overall'
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-[#FAF8F5] border border-[#D5CFC9] text-[#524E48]'
              }`}
            >
              Overall Weighted Score
            </button>
            <button
              onClick={() => setSortCriterion('landed')}
              className={`py-1 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortCriterion === 'landed'
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-[#FAF8F5] border border-[#D5CFC9] text-[#524E48]'
              }`}
            >
              Lowest Landed Cost
            </button>
            <button
              onClick={() => setSortCriterion('quality')}
              className={`py-1 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortCriterion === 'quality'
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-[#FAF8F5] border border-[#D5CFC9] text-[#524E48]'
              }`}
            >
              Highest Quality
            </button>
            <button
              onClick={() => setSortCriterion('delivery')}
              className={`py-1 px-3 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortCriterion === 'delivery'
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-[#FAF8F5] border border-[#D5CFC9] text-[#524E48]'
              }`}
            >
              Shortest Lead Time
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table with Transparent Explanation */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Supplier &amp; Depot</th>
                <th className="py-3.5 px-4">Raw Quote</th>
                <th className="py-3.5 px-4">Freight / Transport</th>
                <th className="py-3.5 px-4">Tax (GST)</th>
                <th className="py-3.5 px-4">Total Landed Cost</th>
                <th className="py-3.5 px-4">MOQ</th>
                <th className="py-3.5 px-4">Lead Time</th>
                <th className="py-3.5 px-4">Quality Score</th>
                <th className="py-3.5 px-4">Procurement Score</th>
                <th className="py-3.5 px-4">Decision Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {sortedQuotes.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-[#FAF8F5] transition-colors ${
                    idx === 0 ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-bold font-tabular text-[#1E1E1E]">
                    {idx === 0 ? (
                      <span className="w-6 h-6 rounded-full bg-[#1E1E1E] text-white inline-flex items-center justify-center text-xs">
                        1
                      </span>
                    ) : (
                      idx + 1
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1E1E1E] block">{item.supplierName}</span>
                    <span className="text-[10px] text-[#78716C]">{item.location}</span>
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#524E48]">
                    {settings.currencySymbol}{item.materialPrice.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#524E48]">
                    +{settings.currencySymbol}{item.transportCost.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#78716C]">
                    {item.taxPercent}%
                  </td>

                  <td className="py-3 px-4 font-bold font-tabular text-emerald-800 text-sm">
                    {settings.currencySymbol}{item.totalLandedCost.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#524E48]">
                    {item.moq} units
                  </td>

                  <td className="py-3 px-4 font-tabular text-[#1E1E1E]">
                    {item.leadTimeDays} days
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-[#1E1E1E] font-tabular">
                      {item.qualityScore}/100
                    </span>
                    <span className="block text-[10px] text-[#78716C]">Grade {item.qualityGrade}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-serif-display text-base font-bold text-[#1E1E1E] font-tabular">
                      {item.compositeScore}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] block">/100</span>
                  </td>

                  <td className="py-3 px-4 max-w-xs text-[11px] text-[#524E48] leading-relaxed">
                    {item.rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
