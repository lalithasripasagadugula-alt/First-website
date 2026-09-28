import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { customerLogin, customerRegister } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login inputs
  const [identifier, setIdentifier] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regPincode, setRegPincode] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = customerLogin(identifier, password);
    if (res.success) {
      onClose();
      onLoginSuccess();
    } else {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPass !== regConfirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = customerRegister({
      name: regName,
      mobile: regMobile,
      email: regEmail,
      line1: regAddress,
      city: regCity,
      state: regState,
      pincode: regPincode,
    });

    if (res.success) {
      onClose();
      onLoginSuccess();
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A6B]">
            DreamNest Customer Portal
          </span>
          <h2 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            {mode === 'login'
              ? 'Access saved addresses, order tracking, and custom dimensions'
              : 'Join DreamNest for 10-year warranty management and sleep trials'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#524E48] block mb-1">
                Email Address or Mobile Number
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. rahul.sharma@example.com or 9876543210"
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#524E48]">Password / OTP</label>
                <span className="text-[11px] text-[#8C7A6B] cursor-pointer hover:underline">
                  Forgot Password?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#1E1E1E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn size={15} />
              <span>Sign In to Customer Dashboard</span>
            </button>

            {/* Quick Demo Credentials hint */}
            <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-3 text-[11px] text-[#78716C] space-y-1">
              <span className="font-semibold text-[#1E1E1E] block">Demo Customer Access:</span>
              <p>Email: rahul.sharma@example.com (Password: any)</p>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-[#524E48] hover:text-[#1E1E1E] cursor-pointer"
              >
                Don't have an account? <strong className="underline">Register here</strong>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-xs text-[#524E48] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[#524E48] block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-xs text-[#524E48] block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[#524E48] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-xs text-[#524E48] block mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={regConfirmPass}
                  onChange={(e) => setRegConfirmPass(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#524E48] block mb-1">Delivery Address</label>
              <input
                type="text"
                required
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="House / Flat / Street"
                className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-[#524E48] block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-xs text-[#524E48] block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>
              <div>
                <label className="text-xs text-[#524E48] block mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={regPincode}
                  onChange={(e) => setRegPincode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs font-mono focus:outline-[#1E1E1E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#524E48] hover:text-[#1E1E1E] cursor-pointer"
              >
                Already have an account? <strong className="underline">Sign In</strong>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
