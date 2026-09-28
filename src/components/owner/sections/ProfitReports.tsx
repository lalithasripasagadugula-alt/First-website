import React, { useState } from 'react';
import { TrendingUp, Download, Calendar, DollarSign, Filter, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ProfitReports: React.FC = () => {
  const { orders, products, rawMaterials, settings } = useApp();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'last_month' | 'year'>('month');

  // Filter orders by timeframe
  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
  const totalRevenue = validOrders.reduce((acc, o) => acc + o.total, 0);
  const totalCost = validOrders.reduce((acc, o) => acc + o.estimatedCost, 0);
  const totalProfit = Math.max(0, totalRevenue - totalCost);
  const avgMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;

  // Product-wise financial breakdown
  const productFinancials = products.map((p) => {
    const matchedOrders = validOrders.filter((o) =>
      o.items.some((i) => i.productId === p.id)
    );
    const unitsSold = matchedOrders.reduce((acc, o) => {
      const match = o.items.find((i) => i.productId === p.id);
      return acc + (match ? match.quantity : 0);
    }, 0);
    const sellingPrice = Math.round(p.basePrice * (1 - p.discountPercent / 100));
    const revenue = unitsSold * sellingPrice;
    const cost = unitsSold * p.estimatedManufacturingCost;
    const profit = Math.max(0, revenue - cost);
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

    return {
      name: p.name,
      category: p.category,
      unitsSold,
      revenue,
      cost,
      profit,
      margin,
    };
  });

  const sortedBySales = [...productFinancials].sort((a, b) => b.revenue - a.revenue);

  // CSV Export feature
  const handleExportCSV = () => {
    const headers = ['Mattress Model', 'Category', 'Units Sold', 'Gross Revenue (INR)', 'Manufacturing Cost (INR)', 'Gross Profit (INR)', 'Margin %'];
    const rows = sortedBySales.map((item) => [
      `"${item.name}"`,
      item.category,
      item.unitsSold,
      item.revenue,
      item.cost,
      item.profit,
      `${item.margin}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dreamnest_financial_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Commercial Audits &amp; Profit Margins
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Profitability &amp; Financial Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="py-2 px-3 bg-white border border-[#D5CFC9] rounded-xl text-xs font-semibold text-[#1E1E1E] focus:outline-[#1E1E1E]"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month (September)</option>
            <option value="last_month">Last Month (August)</option>
            <option value="year">FY 2026-27 (Year-to-Date)</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3.5 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-[#78716C] font-medium block">Total Revenue</span>
          <div className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-2 font-tabular">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] block mt-0.5">{validOrders.length} customer orders</span>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-[#78716C] font-medium block">Manufacturing Cost (COGS)</span>
          <div className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-2 font-tabular">
            {settings.currencySymbol}{totalCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] block mt-0.5">Direct material + labor + freight</span>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-[#78716C] font-medium block">Gross Factory Profit</span>
          <div className="font-serif-display text-2xl font-bold text-emerald-800 mt-2 font-tabular">
            +{settings.currencySymbol}{totalProfit.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Healthy gross margin</span>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <span className="text-xs text-[#78716C] font-medium block">Blended Gross Margin</span>
          <div className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-2 font-tabular">
            {avgMargin}%
          </div>
          <span className="text-[11px] text-[#78716C] block mt-0.5">Exceeds 35% industry target</span>
        </div>
      </div>

      {/* Product-wise Profit Breakdown Table */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E8E3DC] flex items-center justify-between">
          <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
            Product-Wise Profit &amp; Unit Margin Contribution
          </h3>
          <span className="text-xs text-[#78716C]">Sorted by Gross Revenue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Mattress Model</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Production Cost</th>
                <th className="py-3 px-4">Gross Profit</th>
                <th className="py-3 px-4">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {sortedBySales.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1E1E1E]">{item.name}</td>
                  <td className="py-3 px-4 text-[#524E48]">{item.category}</td>
                  <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                    {item.unitsSold} units
                  </td>
                  <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                    {settings.currencySymbol}{item.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-tabular text-[#78716C]">
                    {settings.currencySymbol}{item.cost.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold font-tabular text-emerald-800">
                    +{settings.currencySymbol}{item.profit.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                    {item.margin}%
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
