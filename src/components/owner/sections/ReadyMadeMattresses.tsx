import React, { useState } from 'react';
import { BedDouble, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ReadyMadeMattress } from '../../../types';

export const ReadyMadeMattresses: React.FC = () => {
  const { readyMadeMattresses, settings } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            External OEM Sourcing &amp; Landed Margins
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Ready-Made Mattress Procurement ({readyMadeMattresses.length})
          </h1>
        </div>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Brand &amp; Model</th>
                <th className="py-3.5 px-4">Supplier &amp; Location</th>
                <th className="py-3.5 px-4">Size &amp; Thickness</th>
                <th className="py-3.5 px-4">Core Material</th>
                <th className="py-3.5 px-4">Supplier Rate</th>
                <th className="py-3.5 px-4">Freight</th>
                <th className="py-3.5 px-4">Landed Cost</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Gross Margin</th>
                <th className="py-3.5 px-4">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {readyMadeMattresses.map((rm) => (
                <tr key={rm.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                    {rm.brand} - {rm.model}
                  </td>
                  <td className="py-3 px-4 text-[#524E48]">
                    <span className="font-medium text-[#1E1E1E] block">{rm.supplierName}</span>
                    <span className="text-[10px] text-[#78716C]">{rm.location}</span>
                  </td>
                  <td className="py-3 px-4 text-[#1E1E1E]">{rm.size} · {rm.thickness}"</td>
                  <td className="py-3 px-4 text-[#524E48]">{rm.material}</td>
                  <td className="py-3 px-4 font-tabular text-[#524E48]">
                    {settings.currencySymbol}{rm.supplierPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-tabular text-[#78716C]">
                    +{settings.currencySymbol}{rm.transportCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                    {settings.currencySymbol}{rm.totalLandedCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold font-tabular text-emerald-800">
                    {settings.currencySymbol}{rm.suggestedSellingPrice.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold font-tabular text-emerald-700">
                    {rm.expectedMarginPercent}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {rm.availability}
                    </span>
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
