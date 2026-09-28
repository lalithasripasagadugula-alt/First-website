import React, { useState } from 'react';
import { Boxes, Plus, Minus, AlertTriangle, ArrowUpDown, History, CheckCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { InventoryTransaction } from '../../../types';

export const InventoryManagement: React.FC = () => {
  const {
    rawMaterials,
    products,
    readyMadeMattresses,
    inventoryTransactions,
    recordInventoryTransaction,
    updateRawMaterial,
    updateProduct,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'raw' | 'finished' | 'readymade' | 'log'>('raw');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState<{ id: string; name: string; category: string; currentStock: number; unit: string } | null>(null);
  const [adjustType, setAdjustType] = useState<'Stock In' | 'Stock Out' | 'Adjustment' | 'Damaged'>('Stock In');
  const [adjustQty, setAdjustQty] = useState(50);
  const [adjustNotes, setAdjustNotes] = useState('');

  const lowStockMaterials = rawMaterials.filter((m) => m.currentStock <= m.reorderLevel);

  const handleOpenAdjust = (item: { id: string; name: string; category: string; currentStock: number; unit: string }) => {
    setAdjustItem(item);
    setAdjustQty(10);
    setAdjustNotes('');
    setShowAdjustModal(true);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem) return;

    let newStock = adjustItem.currentStock;
    if (adjustType === 'Stock In') {
      newStock += adjustQty;
    } else {
      newStock = Math.max(0, newStock - adjustQty);
    }

    // Update raw material or product
    if (adjustItem.category === 'Raw Material') {
      const mat = rawMaterials.find((m) => m.id === adjustItem.id);
      if (mat) {
        updateRawMaterial({ ...mat, currentStock: newStock });
      }
    } else if (adjustItem.category === 'Finished Mattress') {
      const prod = products.find((p) => p.id === adjustItem.id);
      if (prod) {
        updateProduct({ ...prod, stock: newStock });
      }
    }

    // Record transaction
    recordInventoryTransaction({
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: adjustType,
      itemCategory: adjustItem.category as any,
      itemName: adjustItem.name,
      quantity: adjustQty,
      unit: adjustItem.unit,
      referenceNumber: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: adjustNotes || `Manual adjustment by operator`,
    });

    setShowAdjustModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Warehousing &amp; Real-Time Inventory Control
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Inventory &amp; Stock Ledger
          </h1>
        </div>

        {lowStockMaterials.length > 0 && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3.5 py-2 rounded-xl font-medium">
            <AlertTriangle size={15} />
            <span>{lowStockMaterials.length} materials below reorder threshold</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E3DC] overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('raw')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'raw'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          Raw Materials ({rawMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('finished')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'finished'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          Finished Mattresses ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('readymade')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'readymade'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          Ready-Made Mattresses ({readyMadeMattresses.length})
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'log'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          Audit Ledger ({inventoryTransactions.length})
        </button>
      </div>

      {/* Raw Materials Table */}
      {activeTab === 'raw' && (
        <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Material Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Reorder Level</th>
                  <th className="py-3.5 px-4">Unit Rate</th>
                  <th className="py-3.5 px-4">Total Value</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {rawMaterials.map((mat) => {
                  const isLow = mat.currentStock <= mat.reorderLevel;
                  return (
                    <tr key={mat.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                        {mat.name}
                        <span className="block text-[10px] text-[#78716C] font-mono">{mat.densitySpec}</span>
                      </td>

                      <td className="py-3 px-4 text-[#524E48]">{mat.category}</td>

                      <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                        <span className={isLow ? 'text-rose-600 font-bold' : ''}>
                          {mat.currentStock} {mat.unit}
                        </span>
                        {isLow && (
                          <span className="ml-2 text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-medium">
                            Low Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-[#78716C] font-tabular">
                        {mat.reorderLevel} {mat.unit}
                      </td>

                      <td className="py-3 px-4 font-tabular text-[#1E1E1E]">
                        {settings.currencySymbol}{mat.pricePerUnit}/{mat.unit}
                      </td>

                      <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                        {settings.currencySymbol}{Math.round(mat.currentStock * mat.pricePerUnit).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-[#524E48]">{mat.supplierName}</td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            handleOpenAdjust({
                              id: mat.id,
                              name: mat.name,
                              category: 'Raw Material',
                              currentStock: mat.currentStock,
                              unit: mat.unit,
                            })
                          }
                          className="py-1.5 px-3 bg-[#FAF8F5] hover:bg-[#1E1E1E] hover:text-white border border-[#D5CFC9] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Stock In / Out
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Finished Mattresses Table */}
      {activeTab === 'finished' && (
        <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mattress Model</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Finished Stock</th>
                  <th className="py-3.5 px-4">Base Retail Value</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#78716C]">{p.sku}</td>
                    <td className="py-3 px-4 text-[#524E48]">{p.category}</td>
                    <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                      {p.stock} units
                    </td>
                    <td className="py-3 px-4 font-tabular text-[#1E1E1E]">
                      {settings.currencySymbol}{(p.stock * p.basePrice).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          handleOpenAdjust({
                            id: p.id,
                            name: p.name,
                            category: 'Finished Mattress',
                            currentStock: p.stock,
                            unit: 'units',
                          })
                        }
                        className="py-1.5 px-3 bg-[#FAF8F5] hover:bg-[#1E1E1E] hover:text-white border border-[#D5CFC9] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ready-Made Mattresses Table */}
      {activeTab === 'readymade' && (
        <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Brand &amp; Model</th>
                  <th className="py-3.5 px-4">Supplier Location</th>
                  <th className="py-3.5 px-4">Size &amp; Thickness</th>
                  <th className="py-3.5 px-4">Supplier Price</th>
                  <th className="py-3.5 px-4">Landed Cost</th>
                  <th className="py-3.5 px-4">Retail Price</th>
                  <th className="py-3.5 px-4">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {readyMadeMattresses.map((rm) => (
                  <tr key={rm.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                      {rm.brand} - {rm.model}
                    </td>
                    <td className="py-3 px-4 text-[#524E48]">{rm.location}</td>
                    <td className="py-3 px-4 text-[#1E1E1E]">{rm.size} · {rm.thickness}"</td>
                    <td className="py-3 px-4 font-tabular text-[#524E48]">
                      {settings.currencySymbol}{rm.supplierPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-tabular font-bold text-[#1E1E1E]">
                      {settings.currencySymbol}{rm.totalLandedCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-tabular font-bold text-emerald-800">
                      {settings.currencySymbol}{rm.suggestedSellingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold font-tabular text-emerald-700">
                      {rm.expectedMarginPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      {activeTab === 'log' && (
        <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Date / Time</th>
                  <th className="py-3.5 px-4">Transaction Type</th>
                  <th className="py-3.5 px-4">Item &amp; Category</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Reference #</th>
                  <th className="py-3.5 px-4">Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {inventoryTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 text-[#78716C] font-mono">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          tx.type === 'Stock In'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : tx.type === 'Sales Deduction'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : tx.type === 'Manufacturing Consumption'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                      {tx.itemName}
                      <span className="block text-[10px] text-[#78716C] font-normal">{tx.itemCategory}</span>
                    </td>
                    <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                      {tx.quantity} {tx.unit}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#524E48]">{tx.referenceNumber}</td>
                    <td className="py-3 px-4 text-[#524E48]">{tx.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && adjustItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 my-auto">
            <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E] mb-1">
              Adjust Stock: {adjustItem.name}
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              Current Registered Level: <strong className="text-[#1E1E1E] font-tabular">{adjustItem.currentStock} {adjustItem.unit}</strong>
            </p>

            <form onSubmit={handleApplyAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                >
                  <option value="Stock In">Stock In (+ Inward Reorder / Inbound)</option>
                  <option value="Stock Out">Stock Out (- Dispatch)</option>
                  <option value="Damaged">Damaged / Scrap (- Defect)</option>
                  <option value="Adjustment">Audit Physical Count Adjustment</option>
                </select>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Quantity ({adjustItem.unit})</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                />
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">PO Number or Notes</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Received shipment from Surat Mills"
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-[#EFECE6] rounded-xl font-semibold text-[#524E48]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1E1E1E] hover:bg-[#33312E] text-white rounded-xl font-semibold"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
