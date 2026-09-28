import React, { useState } from 'react';
import { Layers, Plus, Search, AlertTriangle, Phone, MapPin, Edit3, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { RawMaterial } from '../../../types';

export const RawMaterialsManagement: React.FC = () => {
  const { rawMaterials, addRawMaterial, updateRawMaterial, deleteRawMaterial, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RawMaterial['category']>('Foam');
  const [supplierName, setSupplierName] = useState('Deccan PolyFoams Ltd');
  const [location, setLocation] = useState('Hyderabad, Telangana');
  const [currentStock, setCurrentStock] = useState(1000);
  const [unit, setUnit] = useState<RawMaterial['unit']>('kg');
  const [pricePerUnit, setPricePerUnit] = useState(200);
  const [minOrderQty, setMinOrderQty] = useState(250);
  const [leadTimeDays, setLeadTimeDays] = useState(3);
  const [qualityGrade, setQualityGrade] = useState<RawMaterial['qualityGrade']>('A+');
  const [densitySpec, setDensitySpec] = useState('40 kg/m³ high resilience');
  const [reorderLevel, setReorderLevel] = useState(500);
  const [supplierContact, setSupplierContact] = useState('+91 40 2717 8890');

  const categories = ['All', 'Foam', 'Springs', 'Fabric', 'Cover', 'Adhesives', 'Packaging', 'Accessories'];

  const filteredMaterials = rawMaterials.filter((m) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setName('');
    setCategory('Foam');
    setSupplierName('Deccan PolyFoams Ltd');
    setLocation('Hyderabad, Telangana');
    setCurrentStock(1000);
    setUnit('kg');
    setPricePerUnit(220);
    setMinOrderQty(300);
    setLeadTimeDays(2);
    setQualityGrade('A+');
    setDensitySpec('45 kg/m³ open-cell');
    setReorderLevel(400);
    setSupplierContact('+91 40 2717 8890');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMaterial) {
      updateRawMaterial({
        ...editingMaterial,
        name,
        category,
        supplierName,
        location,
        currentStock,
        unit,
        pricePerUnit,
        minOrderQty,
        leadTimeDays,
        qualityGrade,
        densitySpec,
        reorderLevel,
        supplierContact,
      });
    } else {
      addRawMaterial({
        id: `mat-${Date.now()}`,
        name,
        category,
        supplierId: 'supp-1',
        supplierName,
        location,
        currentStock,
        unit,
        pricePerUnit,
        minOrderQty,
        leadTimeDays,
        qualityGrade,
        densitySpec,
        lastPurchasePrice: pricePerUnit * 0.96,
        currentMarketPrice: pricePerUnit,
        reorderLevel,
        status: currentStock <= reorderLevel ? 'Low Stock' : 'In Stock',
        supplierContact,
        notes: 'Factory production line input material.',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Bill of Materials Component Sourcing
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Raw Materials Catalog ({rawMaterials.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Add Raw Material</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`py-1.5 px-3 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === c
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-white border border-[#E2DDD5] text-[#524E48] hover:border-[#1E1E1E]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Search material or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-white border border-[#D5CFC9] rounded-xl text-xs focus:outline-[#1E1E1E] w-56"
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Material &amp; Specification</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Primary Supplier</th>
                <th className="py-3.5 px-4">Unit Rate</th>
                <th className="py-3.5 px-4">MOQ</th>
                <th className="py-3.5 px-4">Lead Time</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Quality Grade</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {filteredMaterials.map((mat) => {
                const isLow = mat.currentStock <= mat.reorderLevel;
                return (
                  <tr key={mat.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1E1E1E] block">{mat.name}</span>
                      <span className="text-[10px] text-[#78716C] font-mono">{mat.densitySpec}</span>
                    </td>

                    <td className="py-3 px-4 text-[#524E48]">{mat.category}</td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-[#1E1E1E] block">{mat.supplierName}</span>
                      <span className="text-[10px] text-[#8C7A6B] flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{mat.location}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1E1E1E] font-tabular">
                      {settings.currencySymbol}{mat.pricePerUnit}/{mat.unit}
                    </td>

                    <td className="py-3 px-4 text-[#524E48] font-tabular">
                      {mat.minOrderQty} {mat.unit}
                    </td>

                    <td className="py-3 px-4 text-[#524E48] font-tabular">
                      {mat.leadTimeDays} days
                    </td>

                    <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                      <span className={isLow ? 'text-rose-600' : ''}>
                        {mat.currentStock} {mat.unit}
                      </span>
                      {isLow && (
                        <span className="block text-[10px] text-rose-600 font-semibold">
                          ⚠️ Reorder Needed
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E3DC] text-[#1E1E1E]">
                        Grade {mat.qualityGrade}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteRawMaterial(mat.id)}
                        className="p-1.5 rounded-lg text-[#9E9790] hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mb-1">
              Add Manufacturing Raw Material
            </h3>
            <p className="text-xs text-[#78716C] mb-6">
              Track technical density, supplier rate, minimum order quantity, and factory lead time.
            </p>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Material Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Memory Foam 55D"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  >
                    <option>Foam</option>
                    <option>Springs</option>
                    <option>Fabric</option>
                    <option>Cover</option>
                    <option>Adhesives</option>
                    <option>Packaging</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Supplier Name</label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Price per Unit (₹)</label>
                  <input
                    type="number"
                    required
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Unit of Measure</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  >
                    <option value="kg">kg</option>
                    <option value="meters">meters</option>
                    <option value="units">units</option>
                    <option value="liters">liters</option>
                    <option value="rolls">rolls</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Quality Grade</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-mono focus:outline-[#1E1E1E]"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Current Stock</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Reorder Alert Level</label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Density &amp; Technical Spec</label>
                <input
                  type="text"
                  value={densitySpec}
                  onChange={(e) => setDensitySpec(e.target.value)}
                  placeholder="e.g. 55 kg/m³ open-cell thermal gel"
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#FAF8F5] hover:bg-[#EFECE6] rounded-xl font-semibold text-[#524E48]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1E1E1E] hover:bg-[#33312E] text-white rounded-xl font-semibold"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
