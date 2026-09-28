import React, { useState } from 'react';
import { Truck, MapPin, Phone, Mail, Star, ExternalLink, Plus, Search, Building2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Supplier } from '../../../types';
import { RatingStars } from '../../common/RatingStars';

export const SupplierManagement: React.FC<{ onNavigateToComparison: () => void }> = ({
  onNavigateToComparison,
}) => {
  const { suppliers, addSupplier } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0] || null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      searchTerm.trim() === '' ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.materialsSupplied.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Vendor Partnerships &amp; Logistics Hubs
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Supplier Directory &amp; Locations ({suppliers.length})
          </h1>
        </div>

        <button
          onClick={onNavigateToComparison}
          className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Run Landed Cost Comparison</span>
          <ExternalLink size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Suppliers List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Search by vendor name, city or supplied material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#D5CFC9] rounded-xl text-xs focus:outline-[#1E1E1E]"
            />
          </div>

          <div className="space-y-3">
            {filteredSuppliers.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedSupplier?.id === s.id
                    ? 'border-[#1E1E1E] shadow-sm ring-1 ring-[#1E1E1E]'
                    : 'border-[#E8E3DC] hover:border-[#D5CFC9]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[#1E1E1E]">
                      {s.name}
                    </h3>
                    <p className="text-xs text-[#78716C]">{s.company}</p>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FAF8F5] border border-[#E8E3DC] px-2 py-0.5 rounded-md text-[#1E1E1E]">
                    Avg. {s.avgLeadTimeDays}d Delivery
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.materialsSupplied.map((mat) => (
                    <span
                      key={mat}
                      className="text-[10px] bg-[#FAF9F5] border border-[#EFECE6] px-2 py-0.5 rounded text-[#524E48]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-[#524E48]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#8C7A6B]" />
                    <span>{s.city}, {s.state}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#78716C]">Quality:</span>
                      <RatingStars rating={s.qualityRating} size={11} showScore />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-[#78716C]">Reliability:</span>
                      <strong className="text-[#1E1E1E] font-tabular">{s.reliabilityRating}/5</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Supplier Detail & Logistics Map Preview */}
        <div className="lg:col-span-5">
          {selectedSupplier ? (
            <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-7 space-y-6 shadow-xs sticky top-4">
              <div>
                <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-wider">
                  Vendor Dossier
                </span>
                <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-0.5">
                  {selectedSupplier.name}
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">{selectedSupplier.company}</p>
              </div>

              {/* Geographic Coordinates & Location Card */}
              <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-2xl p-4 space-y-2.5 text-xs text-[#524E48]">
                <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1E1E1E]">
                    <MapPin size={14} className="text-[#B88E2F]" />
                    <span>Factory &amp; Depot Coordinates</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#78716C]">
                    {selectedSupplier.lat.toFixed(4)}° N, {selectedSupplier.lng.toFixed(4)}° E
                  </span>
                </div>

                <p className="leading-relaxed">{selectedSupplier.address}</p>
                <p>{selectedSupplier.city}, {selectedSupplier.state} - {selectedSupplier.pincode}</p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#8C7A6B]">
                  <span>Direct Freight to Cherlapally Plant:</span>
                  <strong className="text-[#1E1E1E]">
                    {selectedSupplier.city === 'Hyderabad' ? 'Local (~25 km)' : 'Interstate Freight'}
                  </strong>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE6]">
                  <div className="flex items-center gap-2 text-[#524E48]">
                    <Phone size={14} className="text-[#8C7A6B]" />
                    <span>Phone:</span>
                  </div>
                  <strong className="text-[#1E1E1E] font-mono">{selectedSupplier.phone}</strong>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#EFECE6]">
                  <div className="flex items-center gap-2 text-[#524E48]">
                    <Mail size={14} className="text-[#8C7A6B]" />
                    <span>Email:</span>
                  </div>
                  <strong className="text-[#1E1E1E]">{selectedSupplier.email}</strong>
                </div>
              </div>

              {/* Operational Reliability */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1E1E1E] uppercase tracking-wider block">
                  Procurement Track Record
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EFECE6]">
                    <span className="text-[#78716C] block text-[11px]">Orders Fulfilled:</span>
                    <strong className="text-sm font-bold text-[#1E1E1E] font-tabular">
                      {selectedSupplier.totalOrdersCount} purchase batches
                    </strong>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EFECE6]">
                    <span className="text-[#78716C] block text-[11px]">Avg. Delivery Time:</span>
                    <strong className="text-sm font-bold text-[#1E1E1E] font-tabular">
                      {selectedSupplier.avgLeadTimeDays} business days
                    </strong>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#66615C] bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E3DC] leading-relaxed">
                <strong className="text-[#1E1E1E] block mb-0.5">Procurement Notes:</strong>
                {selectedSupplier.notes}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E3DC] rounded-3xl p-12 text-center text-xs text-[#78716C]">
              Select a supplier from the list to view facility locations and logistics metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
