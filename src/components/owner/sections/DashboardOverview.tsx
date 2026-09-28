import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Boxes,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const DashboardOverview: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => {
  const { orders, rawMaterials, products, settings } = useApp();

  // Metrics calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled').length;

  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.total : sum), 0);
  const totalCost = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.estimatedCost : sum), 0);
  const estimatedProfit = Math.max(0, totalRevenue - totalCost);
  const grossMarginPercent = totalRevenue > 0 ? Math.round((estimatedProfit / totalRevenue) * 100) : 0;

  // Inventory value (rough calculation of raw materials in stock)
  const inventoryValue = rawMaterials.reduce((acc, m) => acc + m.currentStock * m.pricePerUnit, 0);
  const lowStockItems = rawMaterials.filter((m) => m.currentStock <= m.reorderLevel);

  // Today's orders
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.orderDate.startsWith(todayStr));
  const todaySales = todayOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Factory Operations &amp; Commercial Executive Summary
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Manufacturing &amp; Sales Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('orders')}
            className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Process Orders ({pendingOrders})
          </button>
          <button
            onClick={() => onNavigate('manufacturing')}
            className="py-2.5 px-4 bg-white border border-[#D5CFC9] hover:bg-[#FAF8F5] text-[#1E1E1E] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Production Floor
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Total Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-3 font-tabular">
            {settings.currencySymbol}{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-1">
            <span>+{todaySales > 0 ? `${settings.currencySymbol}${todaySales.toLocaleString()} today` : 'Healthy demand'}</span>
          </span>
        </div>

        {/* Estimated Gross Profit */}
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Estimated Gross Profit</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] text-[#B88E2F] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-3 font-tabular">
            {settings.currencySymbol}{estimatedProfit.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#78716C] block mt-1">
            Gross Margin: <strong className="text-[#1E1E1E] font-tabular">{grossMarginPercent}%</strong>
          </span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-3 font-tabular">
            {pendingOrders}
          </div>
          <span className="text-[11px] text-[#78716C] block mt-1">
            Completed: <strong className="text-[#1E1E1E] font-tabular">{completedOrders}</strong> · Total: {totalOrders}
          </span>
        </div>

        {/* Inventory Value & Alert */}
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#78716C] font-medium">Raw Material Stock</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Boxes size={16} />
            </div>
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1E1E1E] mt-3 font-tabular">
            {settings.currencySymbol}{Math.round(inventoryValue).toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold block mt-1">
            {lowStockItems.length > 0 ? `⚠️ ${lowStockItems.length} Materials At Reorder Level` : 'Stock Levels Optimal'}
          </span>
        </div>
      </div>

      {/* Visual Analytics & Operational Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monthly Revenue Chart Simulation */}
        <div className="lg:col-span-8 bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-4">
            <div>
              <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
                Revenue &amp; Manufacturing Profit Trends (₹)
              </h3>
              <p className="text-xs text-[#78716C]">
                Monthly performance comparison (Direct Storefront vs Factory Cost of Goods)
              </p>
            </div>
            <span className="text-xs font-semibold text-[#8C7A6B] bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#E8E3DC]">
              FY 2026-27
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {[
                { month: 'Apr', rev: 420000, profit: 180000 },
                { month: 'May', rev: 510000, profit: 220000 },
                { month: 'Jun', rev: 480000, profit: 205000 },
                { month: 'Jul', rev: 590000, profit: 260000 },
                { month: 'Aug', rev: 670000, profit: 295000 },
                { month: 'Sep (Current)', rev: 780000, profit: 345000 },
              ].map((bar, i) => {
                const max = 800000;
                const revHeight = `${(bar.rev / max) * 100}%`;
                const profitHeight = `${(bar.profit / max) * 100}%`;
                return (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: revHeight }}
                        className="w-1/2 max-w-[28px] bg-[#1E1E1E] group-hover:bg-[#33312E] rounded-t-md transition-all relative"
                        title={`Revenue: ₹${bar.rev.toLocaleString()}`}
                      />
                      {/* Profit Bar */}
                      <div
                        style={{ height: profitHeight }}
                        className="w-1/2 max-w-[28px] bg-[#C9A96E] group-hover:bg-[#B8985D] rounded-t-md transition-all relative"
                        title={`Gross Profit: ₹${bar.profit.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] text-[#78716C] font-medium text-center truncate max-w-[60px]">
                      {bar.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[#F2EFE9] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#1E1E1E] rounded-sm" />
                <span className="text-[#524E48]">Gross Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#C9A96E] rounded-sm" />
                <span className="text-[#524E48]">Estimated Factory Gross Profit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fast Moving Mattresses & Low Stock Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 space-y-4 shadow-xs">
            <h4 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
              Top Revenue Mattresses
            </h4>
            <div className="space-y-3 text-xs">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <div>
                    <h5 className="font-semibold text-[#1E1E1E] line-clamp-1">{p.name}</h5>
                    <span className="text-[11px] text-[#78716C]">{p.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-tabular text-[#1E1E1E] block">
                      {settings.currencySymbol}{(p.basePrice * (1 - p.discountPercent / 100)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{p.stock} units ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Material Warnings */}
          <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
                Critical Materials Reorder
              </h4>
              <button
                onClick={() => onNavigate('raw-materials')}
                className="text-[11px] font-semibold text-[#8C7A6B] hover:underline"
              >
                View All
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-emerald-700">All 10 raw materials above reorder thresholds.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {lowStockItems.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-[#1E1E1E] block">{mat.name}</span>
                      <span className="text-[10px] text-rose-700">
                        Current: {mat.currentStock} {mat.unit} (Min: {mat.reorderLevel} {mat.unit})
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate('supplier-comparison')}
                      className="py-1 px-2.5 bg-rose-700 text-white text-[10px] font-semibold rounded-lg hover:bg-rose-800 transition-colors"
                    >
                      Compare Quotes
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
