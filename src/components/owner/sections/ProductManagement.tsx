import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Product, MattressCategory, MattressStandardSize } from '../../../types';
import { INITIAL_IMAGES } from '../../../data/demoData';

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<MattressCategory>('Orthopedic');
  const [tagline, setTagline] = useState('');
  const [basePrice, setBasePrice] = useState(19999);
  const [discountPercent, setDiscountPercent] = useState(15);
  const [manufacturingCost, setManufacturingCost] = useState(9500);
  const [firmness, setFirmness] = useState<Product['firmness']>('Balanced Medium');
  const [material, setMaterial] = useState('');
  const [foamDensity, setFoamDensity] = useState('Core 50 kg/m³');
  const [stock, setStock] = useState(20);
  const [warrantyYears, setWarrantyYears] = useState(10);
  const [status, setStatus] = useState<Product['status']>('active');

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku(`DN-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('Orthopedic');
    setTagline('High resilience spinal support core');
    setBasePrice(19999);
    setDiscountPercent(12);
    setManufacturingCost(10200);
    setFirmness('Medium Firm');
    setMaterial('High Resilience 40D Foam + Cotton Damask Quilt');
    setFoamDensity('40 kg/m³ Base + 32D Transition');
    setStock(15);
    setWarrantyYears(10);
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setTagline(p.tagline);
    setBasePrice(p.basePrice);
    setDiscountPercent(p.discountPercent);
    setManufacturingCost(p.estimatedManufacturingCost);
    setFirmness(p.firmness);
    setMaterial(p.material);
    setFoamDensity(p.foamDensity);
    setStock(p.stock);
    setWarrantyYears(p.warrantyYears);
    setStatus(p.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        sku,
        category,
        tagline,
        basePrice,
        discountPercent,
        estimatedManufacturingCost: manufacturingCost,
        firmness,
        material,
        foamDensity,
        stock,
        warrantyYears,
        status,
      });
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku,
        name,
        category,
        tagline,
        description: 'Manufactured with high-durability cold-lamination technology at Cherlapally factory.',
        images: [INITIAL_IMAGES.memoryFoam, INITIAL_IMAGES.latexOrtho],
        basePrice,
        discountPercent,
        thicknessOptions: [6, 8, 10],
        standardSizes: ['Single', 'Twin', 'Double', 'Queen', 'King', 'Custom Size'],
        firmness,
        material,
        foamDensity,
        foamType: 'High Resilience Aerocell',
        springType: 'Anatomical Solid Core',
        coverMaterial: '350 GSM Knitted Jacquard',
        weightCapacityKg: 130,
        warrantyYears,
        expectedLifespanYears: warrantyYears + 2,
        trialPeriodDays: 100,
        emiStartingAt: Math.round(basePrice / 12),
        stock,
        status,
        ratings: { quality: 5, comfort: 5, support: 5, durability: 5, value: 5 },
        reviewsCount: 0,
        certifications: ['CertiPUR-US', 'OEKO-TEX Standard 100'],
        deliveryDays: 4,
        returnPolicyDays: 30,
        manufacturingDetails: 'Direct factory fabrication at Cherlapally unit.',
        careInstructions: ['Rotate 180 degrees every 3 months'],
        estimatedManufacturingCost: manufacturingCost,
      };
      addProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Product Catalog &amp; Retail Pricing
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Mattress Models ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Add New Mattress Model</span>
        </button>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">SKU / Model</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Firmness &amp; Density</th>
                <th className="py-3.5 px-4">Mfg. Cost</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Gross Margin</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {products.map((p) => {
                const finalPrice = Math.round(p.basePrice * (1 - p.discountPercent / 100));
                const profit = finalPrice - p.estimatedManufacturingCost;
                const marginPercent = Math.round((profit / finalPrice) * 100);

                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[#F4F1EC]"
                        />
                        <div>
                          <span className="font-semibold text-[#1E1E1E] block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#78716C] font-mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-[#1E1E1E]">{p.category}</td>

                    <td className="py-3 px-4">
                      <span className="text-[#1E1E1E] block">{p.firmness}</span>
                      <span className="text-[10px] text-[#78716C] font-mono">{p.foamDensity}</span>
                    </td>

                    <td className="py-3 px-4 font-tabular text-[#524E48]">
                      {settings.currencySymbol}{p.estimatedManufacturingCost.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1E1E1E] font-tabular">
                      {settings.currencySymbol}{p.basePrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-emerald-700 font-semibold font-tabular">
                      {p.discountPercent}%
                    </td>

                    <td className="py-3 px-4 font-semibold text-emerald-800 font-tabular">
                      {marginPercent}% (+{settings.currencySymbol}{profit.toLocaleString()})
                    </td>

                    <td className="py-3 px-4 font-bold font-tabular text-[#1E1E1E]">
                      {p.stock} units
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-[#524E48] hover:text-[#1E1E1E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-[#9E9790] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
          <div className="relative w-full max-w-2xl bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mb-1">
              {editingProduct ? 'Edit Mattress Model' : 'Create New Mattress Product'}
            </h3>
            <p className="text-xs text-[#78716C] mb-6">
              Configure manufacturing parameters, bill-of-materials cost, and retail selling price.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Model Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">SKU Identifier</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-mono focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MattressCategory)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  >
                    <option>Orthopedic</option>
                    <option>Memory Foam</option>
                    <option>Pocket Spring</option>
                    <option>Bonnell Spring</option>
                    <option>Natural Latex</option>
                    <option>Luxury Hybrid</option>
                    <option>Custom Size</option>
                    <option>Budget Comfort</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Firmness Profile</label>
                  <select
                    value={firmness}
                    onChange={(e) => setFirmness(e.target.value as Product['firmness'])}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  >
                    <option>Extra Firm Orthopedic</option>
                    <option>Medium Firm</option>
                    <option>Balanced Medium</option>
                    <option>Medium Soft</option>
                    <option>Plush (Soft)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Product['status'])}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  >
                    <option value="active">Active (On Store)</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Base Retail Price (Queen 6")</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={70}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Manufacturing Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={manufacturingCost}
                    onChange={(e) => setManufacturingCost(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Foam Density Spec</label>
                  <input
                    type="text"
                    value={foamDensity}
                    onChange={(e) => setFoamDensity(e.target.value)}
                    placeholder="e.g. 50 kg/m³ Core + 32D Transition"
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Initial Finished Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-tabular focus:outline-[#1E1E1E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white font-semibold rounded-xl transition-colors cursor-pointer mt-2"
              >
                {editingProduct ? 'Save Product Changes' : 'Create Product in Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
