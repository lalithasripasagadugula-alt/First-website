import React, { useState } from 'react';
import { Cog, Plus, Play, CheckCircle, AlertTriangle, Layers, X, Calendar } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ProductionOrder, BillOfMaterials } from '../../../types';

export const ManufacturingManagement: React.FC = () => {
  const {
    productionOrders,
    createProductionOrder,
    updateProductionOrderStatus,
    boms,
    products,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'bom'>('orders');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New production order form state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [assignedLine, setAssignedLine] = useState('Cherlapally Assembly Line 1');
  const [notes, setNotes] = useState('Standard festival replenishment batch');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newProdOrder: ProductionOrder = {
      id: `prod-ord-${Date.now()}`,
      orderNumber: `PRD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      batchNumber: `BCH-${selectedProduct.sku.split('-')[1] || 'GEN'}-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity,
      size: 'Queen',
      thickness: 8,
      startDate: new Date().toISOString().split('T')[0],
      status: 'In Production',
      materialsConsumed: [
        {
          materialName: 'High Resilience Foam',
          quantity: quantity * 28,
          unit: 'kg',
          cost: quantity * 28 * 185,
        },
        {
          materialName: 'Quilting Fabric',
          quantity: quantity * 5.5,
          unit: 'meters',
          cost: quantity * 5.5 * 180,
        },
      ],
      totalProductionCost: quantity * selectedProduct.estimatedManufacturingCost,
      assignedLine,
      notes,
    };

    createProductionOrder(newProdOrder);
    setShowNewOrderModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Plant Production Scheduling &amp; Assembly
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Manufacturing &amp; Bill of Materials
          </h1>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Issue Production Order</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E3DC] text-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          Active Production Batches ({productionOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={`py-2.5 px-4 font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'bom'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          BOM Recipes ({boms.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTION ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Batch / Order #</th>
                  <th className="py-3.5 px-4">Mattress Model</th>
                  <th className="py-3.5 px-4">Units</th>
                  <th className="py-3.5 px-4">Assembly Line</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">Est. Cost</th>
                  <th className="py-3.5 px-4">Production Status</th>
                  <th className="py-3.5 px-4 text-right">Advance Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {productionOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1E1E1E]">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-[#78716C] font-normal">{ord.batchNumber}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1E1E1E] block">{ord.productName}</span>
                      <span className="text-[10px] text-[#78716C]">{ord.size} · {ord.thickness}"</span>
                    </td>

                    <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                      {ord.quantity} units
                    </td>

                    <td className="py-3 px-4 text-[#524E48]">{ord.assignedLine}</td>

                    <td className="py-3 px-4 text-[#78716C] font-tabular">{ord.startDate}</td>

                    <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                      {settings.currencySymbol}{ord.totalProductionCost.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase border ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.status === 'In Production'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : ord.status === 'Quality Check'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-[#FAF8F5] text-[#1E1E1E] border-[#E8E3DC]'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {ord.status === 'Planned' && (
                        <button
                          onClick={() => updateProductionOrderStatus(ord.id, 'In Production')}
                          className="py-1 px-2.5 bg-[#1E1E1E] text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                        >
                          Start Line
                        </button>
                      )}
                      {ord.status === 'In Production' && (
                        <button
                          onClick={() => updateProductionOrderStatus(ord.id, 'Quality Check')}
                          className="py-1 px-2.5 bg-blue-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                        >
                          Send to QC
                        </button>
                      )}
                      {ord.status === 'Quality Check' && (
                        <button
                          onClick={() => updateProductionOrderStatus(ord.id, 'Completed')}
                          className="py-1 px-2.5 bg-emerald-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer"
                        >
                          Complete &amp; Stock
                        </button>
                      )}
                      {ord.status === 'Completed' && (
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          ✓ Finished Stock Added
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOM RECIPES */}
      {activeTab === 'bom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {boms.map((bom) => (
            <div
              key={bom.id}
              className="bg-white border border-[#E8E3DC] rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
                    {bom.productName}
                  </h3>
                  <span className="text-xs text-[#78716C]">{bom.standardSize} · {bom.thickness}" Profile</span>
                </div>
                <span className="text-sm font-bold text-[#1E1E1E] font-tabular">
                  Total BOM: {settings.currencySymbol}{bom.totalCost.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">
                  Component Breakdown
                </span>
                {bom.components.map((c, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-[#FAF8F5]">
                    <span className="text-[#524E48]">{c.materialName} ({c.quantityRequired} {c.unit})</span>
                    <span className="font-tabular font-medium text-[#1E1E1E]">
                      {settings.currencySymbol}{c.totalCost.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F2EFE9] grid grid-cols-3 gap-2 text-[11px] text-[#78716C]">
                <div>Labor: ₹{bom.laborCost}</div>
                <div>Packaging: ₹{bom.packagingCost}</div>
                <div>Overhead: ₹{bom.overheadCost}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Production Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
            <button
              onClick={() => setShowNewOrderModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mb-1">
              Issue Factory Production Order
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              Deducts raw materials from inventory and assigns the batch to the assembly schedule.
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Select Mattress Model</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Quantity to Fabricate</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Assigned Line</label>
                  <select
                    value={assignedLine}
                    onChange={(e) => setAssignedLine(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                  >
                    <option>Assembly Line 1</option>
                    <option>CNC Foam Cutting Line 2</option>
                    <option>Pocket Spring Station</option>
                    <option>Latex Fabrication Bay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Production Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-3 text-[11px] text-[#78716C]">
                Estimated Factory Cost: {settings.currencySymbol}
                {(quantity * (selectedProduct?.estimatedManufacturingCost || 11000)).toLocaleString()}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Launch Production Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
