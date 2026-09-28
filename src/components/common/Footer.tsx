import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Award, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onGoToOwnerLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onGoToOwnerLogin }) => {
  const { settings } = useApp();

  return (
    <footer className="bg-[#1C1A18] text-[#D1CBC4] pt-16 pb-12 border-t border-[#2E2A27]">
      {/* 4 Pillars Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2E2A27]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#2A2623] flex items-center justify-center text-[#C9A96E] shrink-0">
              <RefreshCw size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100-Night Trial</h4>
              <p className="text-xs text-[#9E9790] mt-0.5 leading-relaxed">
                Sleep on it risk-free in your own bedroom. Easy hassle-free return.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#2A2623] flex items-center justify-center text-[#C9A96E] shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">10-Year Warranty</h4>
              <p className="text-xs text-[#9E9790] mt-0.5 leading-relaxed">
                Guaranteed zero sagging. Genuine multi-year factory coverage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#2A2623] flex items-center justify-center text-[#C9A96E] shrink-0">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Doorstep Delivery</h4>
              <p className="text-xs text-[#9E9790] mt-0.5 leading-relaxed">
                Direct from our Cherlapally manufacturing plant to your home.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#2A2623] flex items-center justify-center text-[#C9A96E] shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Certified Non-Toxic</h4>
              <p className="text-xs text-[#9E9790] mt-0.5 leading-relaxed">
                OEKO-TEX &amp; CertiPUR-US foams with zero off-gassing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="md:col-span-2">
            <h3 className="font-serif-display text-2xl font-bold text-white tracking-tight">
              {settings.brandName}
            </h3>
            <p className="text-xs text-[#A8A199] mt-3 leading-relaxed max-w-sm">
              Crafting master-grade sleep systems since 2014. We pair precision anatomical foam engineering, individually encased pocket coils, and certified organic fabrics to give you uninterrupted restorative rest.
            </p>
            <div className="mt-5 space-y-2 text-xs text-[#9E9790]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#C9A96E] shrink-0" />
                <span>{settings.businessAddress}, {settings.city} - {settings.pincode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#C9A96E] shrink-0" />
                <span>{settings.supportPhone} (Mon - Sat, 9am - 8pm)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#C9A96E] shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Mattresses links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#9E9790]">
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  Orthopedic Spinal Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  Aerocool Gel Memory Foam
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  Pocket Spring Hybrids
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  100% Organic Natural Latex
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  Custom Size Bed Dimensions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  Budget Comfort Dual Mattresses
                </button>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#9E9790]">
              <li>
                <button onClick={() => onNavigate('customer-dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-white transition-colors cursor-pointer">
                  Mattress Comparison Tool
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-white transition-colors cursor-pointer">
                  Coupons &amp; Offers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Manufacturing Process
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Store Locator &amp; Showrooms
                </button>
              </li>
            </ul>
          </div>

          {/* Factory Plant details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Cherlapally Factory
            </h4>
            <div className="bg-[#262320] border border-[#332E2A] rounded-xl p-3.5 text-xs text-[#A8A199] space-y-1.5">
              <span className="font-semibold text-white block">Direct Factory Unit:</span>
              <p>Daily capacity: 250 mattresses</p>
              <p>Certified CNC foam cutting &amp; Swiss coil winding</p>
              <p className="text-[11px] text-[#7A746D]">GSTIN: {settings.gstNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with quiet Partner/Retailer link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#262320] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A746D] gap-4">
        <div>
          © {new Date().getFullYear()} {settings.brandName}. All rights reserved. Handcrafted in India.
        </div>

        <div className="flex items-center gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>100-Night Guarantee Policy</span>
          {/* Subtle quiet text link for owner login */}
          <button
            onClick={onGoToOwnerLogin}
            className="hover:text-[#D1CBC4] transition-colors cursor-pointer flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            <span>Partner &amp; Retailer Portal</span>
            <ArrowUpRight size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
};
