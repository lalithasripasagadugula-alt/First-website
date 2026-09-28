import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface AccessDeniedProps {
  onReturnHome: () => void;
  onGoToOwnerLogin: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  onReturnHome,
  onGoToOwnerLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#F6F4EE] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#E5E0D8] rounded-2xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600">
          <ShieldAlert size={28} />
        </div>

        <span className="text-xs uppercase tracking-wider text-rose-600 font-semibold font-tabular">
          HTTP 403 · Access Denied
        </span>

        <h1 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-2 mb-3">
          Restricted Enterprise Area
        </h1>

        <p className="text-sm text-[#66615C] leading-relaxed mb-6">
          This portal is reserved strictly for DreamNest manufacturing managers,
          retail owners, and authorized procurement personnel. Customer accounts
          and unauthenticated visitors do not have permission to access operational ERP records.
        </p>

        <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-xl p-4 text-left mb-6 text-xs text-[#524E48] space-y-1.5">
          <div className="flex items-center gap-2 font-medium text-[#1E1E1E]">
            <Lock size={13} className="text-[#8C7A6B]" />
            <span>Security Policy Enforcement:</span>
          </div>
          <p>· Owner and Staff credentials are authenticated on an isolated route.</p>
          <p>· Direct access attempts without cryptographic session verification are blocked.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReturnHome}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-[#1E1E1E] bg-[#F2EDE4] hover:bg-[#EAE4D8] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Return to Store
          </button>
          <button
            onClick={onGoToOwnerLogin}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#1E1E1E] hover:bg-[#33312E] rounded-xl transition-colors cursor-pointer"
          >
            Owner Portal Login
          </button>
        </div>
      </div>
    </div>
  );
};
