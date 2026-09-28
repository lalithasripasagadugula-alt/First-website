import React, { useState } from 'react';
import { Lock, Shield, ArrowLeft, KeyRound, UserCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

interface OwnerLoginProps {
  onSuccess: () => void;
  onReturnToStore: () => void;
}

export const OwnerLogin: React.FC<OwnerLoginProps> = ({
  onSuccess,
  onReturnToStore,
}) => {
  const { ownerLogin } = useApp();
  const [identifier, setIdentifier] = useState('owner@dreamnest.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<Role>('OWNER');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = ownerLogin(identifier, password, selectedRole);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Enterprise authorization failed.');
    }
  };

  const handleQuickRole = (email: string, role: Role) => {
    setIdentifier(email);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-[#181615] text-[#DCD7D0] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar with return button */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2E2925] border border-[#3E3833] flex items-center justify-center text-[#C9A96E]">
            <Shield size={16} />
          </div>
          <span className="font-serif-display font-bold text-lg text-white tracking-wide">
            DreamNest Manufacturing ERP
          </span>
        </div>

        <button
          onClick={onReturnToStore}
          className="text-xs text-[#9E9790] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[#25211E]"
        >
          <ArrowLeft size={13} />
          <span>Exit to Customer Website</span>
        </button>
      </div>

      {/* Center Card */}
      <div className="max-w-md w-full mx-auto bg-[#211E1B] border border-[#332E2A] rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#2A2521] border border-[#3D352F] flex items-center justify-center mx-auto text-[#C9A96E] mb-3">
            <Lock size={20} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C9A96E] font-mono">
            SECURE RESTRICTED GATEWAY
          </span>
          <h1 className="font-serif-display text-2xl font-bold text-white">
            Enterprise Portal Login
          </h1>
          <p className="text-xs text-[#A8A199]">
            Role-Based Access for Manufacturing, Inventory &amp; Procurement
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#A8A199] block mb-1 font-medium">Enterprise Email or Staff ID</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-[#181615] border border-[#3A342F] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#A8A199] block mb-1 font-medium">Security Password / Security Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#181615] border border-[#3A342F] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>

          <div>
            <label className="text-[#A8A199] block mb-1 font-medium">Security Access Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full bg-[#181615] border border-[#3A342F] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C9A96E] transition-colors"
            >
              <option value="OWNER">Owner / Managing Director (Full Access)</option>
              <option value="PROCUREMENT_MANAGER">Procurement Manager (Suppliers &amp; Costing)</option>
              <option value="INVENTORY_MANAGER">Inventory Manager (Stock &amp; BOM)</option>
              <option value="SALES_MANAGER">Sales Manager (Orders &amp; Customers)</option>
              <option value="STAFF">Operations Staff (QC &amp; Assembly)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#C9A96E] hover:bg-[#B8985D] text-[#181615] font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <KeyRound size={15} />
            <span>Authenticate into ERP Dashboard</span>
          </button>
        </form>

        {/* Quick Demo Switchers for Review */}
        <div className="pt-4 border-t border-[#2F2A26] space-y-2">
          <span className="text-[10px] font-semibold text-[#8C847A] uppercase tracking-wider block">
            Select Pre-Configured Demo Profile:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickRole('owner@dreamnest.com', 'OWNER')}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                selectedRole === 'OWNER'
                  ? 'border-[#C9A96E] bg-[#2C2723] text-white'
                  : 'border-[#332E2A] text-[#9E9790] hover:text-white'
              }`}
            >
              <div className="font-semibold text-white">Owner</div>
              <div className="text-[10px] text-[#A8A199]">Full Privileges</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('procurement@dreamnest.com', 'PROCUREMENT_MANAGER')}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                selectedRole === 'PROCUREMENT_MANAGER'
                  ? 'border-[#C9A96E] bg-[#2C2723] text-white'
                  : 'border-[#332E2A] text-[#9E9790] hover:text-white'
              }`}
            >
              <div className="font-semibold text-white">Procurement</div>
              <div className="text-[10px] text-[#A8A199]">Suppliers &amp; Landed</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('inventory@dreamnest.com', 'INVENTORY_MANAGER')}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                selectedRole === 'INVENTORY_MANAGER'
                  ? 'border-[#C9A96E] bg-[#2C2723] text-white'
                  : 'border-[#332E2A] text-[#9E9790] hover:text-white'
              }`}
            >
              <div className="font-semibold text-white">Inventory</div>
              <div className="text-[10px] text-[#A8A199]">Raw Mat &amp; BOM</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="text-center text-[11px] text-[#6E6760]">
        Restricted to authorized DreamNest Bedding Ltd personnel · IP logging &amp; audit trail enabled
      </div>
    </div>
  );
};
