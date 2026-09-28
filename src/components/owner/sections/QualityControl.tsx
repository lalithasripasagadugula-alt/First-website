import React, { useState } from 'react';
import { ShieldCheck, Plus, Check, X, AlertCircle, FileText } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { QualityCheckRecord } from '../../../types';

export const QualityControl: React.FC = () => {
  const { qualityChecks, recordQualityCheck, products } = useApp();
  const [showModal, setShowModal] = useState(false);

  // QC Form State
  const [batchNumber, setBatchNumber] = useState(`BCH-QC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [inspectorName, setInspectorName] = useState('K. Nagesh (Lead Inspector)');

  const [foamDensityCheck, setFoamDensityCheck] = useState(true);
  const [dimensionsCheck, setDimensionsCheck] = useState(true);
  const [thicknessCheck, setThicknessCheck] = useState(true);
  const [firmnessCheck, setFirmnessCheck] = useState(true);
  const [stitchingQualityCheck, setStitchingQualityCheck] = useState(true);
  const [coverQualityCheck, setCoverQualityCheck] = useState(true);
  const [visualInspectionCheck, setVisualInspectionCheck] = useState(true);
  const [packagingInspectionCheck, setPackagingInspectionCheck] = useState(true);

  const [overallStatus, setOverallStatus] = useState<QualityCheckRecord['overallStatus']>('Passed');
  const [qcNotes, setQcNotes] = useState('All dimensional and core density tests passed IS 13488 standards.');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSaveQC = (e: React.FormEvent) => {
    e.preventDefault();
    const newQC: QualityCheckRecord = {
      id: `qc-${Date.now()}`,
      batchNumber,
      productionOrderId: `prd-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorName,
      foamDensityCheck,
      dimensionsCheck,
      thicknessCheck,
      firmnessCheck,
      stitchingQualityCheck,
      coverQualityCheck,
      visualInspectionCheck,
      packagingInspectionCheck,
      overallStatus,
      qcNotes,
    };
    recordQualityCheck(newQC);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Zero-Defect Quality Assurance
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Quality Control &amp; Batch Audits ({qualityChecks.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setBatchNumber(`BCH-QC-${Math.floor(1000 + Math.random() * 9000)}`);
            setShowModal(true);
          }}
          className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Record Inspection Audit</span>
        </button>
      </div>

      {/* QC Audits Table */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Batch Number</th>
                <th className="py-3.5 px-4">Product Model</th>
                <th className="py-3.5 px-4">Inspection Date</th>
                <th className="py-3.5 px-4">Inspector</th>
                <th className="py-3.5 px-4">Density / Core</th>
                <th className="py-3.5 px-4">Dimensions</th>
                <th className="py-3.5 px-4">Stitching</th>
                <th className="py-3.5 px-4">Overall Verdict</th>
                <th className="py-3.5 px-4">Inspection Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {qualityChecks.map((qc) => (
                <tr key={qc.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1E1E1E]">
                    {qc.batchNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                    {qc.productName}
                  </td>
                  <td className="py-3 px-4 text-[#78716C] font-tabular">
                    {qc.inspectionDate}
                  </td>
                  <td className="py-3 px-4 text-[#524E48]">{qc.inspectorName}</td>
                  <td className="py-3 px-4">
                    {qc.foamDensityCheck ? (
                      <span className="text-emerald-700 font-bold">✓ Pass</span>
                    ) : (
                      <span className="text-rose-600 font-bold">✕ Fail</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {qc.dimensionsCheck ? (
                      <span className="text-emerald-700 font-bold">✓ Pass</span>
                    ) : (
                      <span className="text-rose-600 font-bold">✕ Fail</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {qc.stitchingQualityCheck ? (
                      <span className="text-emerald-700 font-bold">✓ Pass</span>
                    ) : (
                      <span className="text-amber-700 font-bold">⚠️ Rework</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase border ${
                        qc.overallStatus === 'Passed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : qc.overallStatus === 'Needs Rework'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {qc.overallStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs text-[11px] text-[#524E48] leading-relaxed">
                    {qc.qcNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QC Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mb-1">
              Record Physical Quality Inspection
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              8-point physical benchmark test before releasing finished goods to the warehouse bay.
            </p>

            <form onSubmit={handleSaveQC} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 font-mono text-xs focus:outline-[#1E1E1E]"
                  />
                </div>
                <div>
                  <label className="text-[#524E48] block mb-1 font-semibold">Product Model</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 8 Checkpoints */}
              <div className="space-y-2 bg-[#FAF9F5] border border-[#E8E3DC] rounded-2xl p-4">
                <span className="font-semibold text-[#1E1E1E] block mb-1">
                  8-Point Physical Inspection Checklist:
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={foamDensityCheck}
                      onChange={(e) => setFoamDensityCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>1. Foam Density Tested</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dimensionsCheck}
                      onChange={(e) => setDimensionsCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>2. Length &amp; Width Passed</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={thicknessCheck}
                      onChange={(e) => setThicknessCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>3. Height Thickness Passed</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={firmnessCheck}
                      onChange={(e) => setFirmnessCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>4. Firmness ILD Verified</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stitchingQualityCheck}
                      onChange={(e) => setStitchingQualityCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>5. Stitching &amp; Piping Intact</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coverQualityCheck}
                      onChange={(e) => setCoverQualityCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>6. Cover Quilting Pristine</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visualInspectionCheck}
                      onChange={(e) => setVisualInspectionCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>7. Visual Defect Inspection</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={packagingInspectionCheck}
                      onChange={(e) => setPackagingInspectionCheck(e.target.checked)}
                      className="accent-[#1E1E1E] rounded"
                    />
                    <span>8. Polyethylene Wrap Sealed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Final QC Verdict</label>
                <select
                  value={overallStatus}
                  onChange={(e) => setOverallStatus(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-[#1E1E1E]"
                >
                  <option value="Passed">Passed (Approved for Delivery)</option>
                  <option value="Needs Rework">Needs Rework (Send to Tailoring)</option>
                  <option value="Failed">Failed (Scrap)</option>
                </select>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Inspection Notes</label>
                <textarea
                  rows={2}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Log Quality Audit &amp; Release Stock
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
