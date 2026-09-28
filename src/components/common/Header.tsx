import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Heart, Search, Menu, X, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenCart,
  onOpenSearch,
  onOpenLogin,
}) => {
  const { cart, wishlist, currentCustomer, comparedProducts, customerLogout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Mattresses' },
    { id: 'compare', label: 'Compare' },
    { id: 'offers', label: 'Offers' },
    { id: 'about', label: 'Craftsmanship' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E3DC]">
      {/* Top micro-announcement banner */}
      <div className="bg-[#1E1E1E] text-[#E8DFD8] text-[11px] py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>Festive Sleep Festival · Up to 20% off handcrafted orthopedic &amp; hybrid mattresses</span>
        <span aria-hidden="true" className="text-[#8C7A6B]">·</span>
        <button
          onClick={() => onNavigate('offers')}
          className="underline hover:text-white transition-colors cursor-pointer"
        >
          View Offers
        </button>
      </div>

      {/* Main 3-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-[#1E1E1E] hover:opacity-90 transition-opacity text-left cursor-pointer"
        >
          DreamNest Mattresses
        </button>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4A4540]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`hover:text-[#1E1E1E] transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                currentTab === link.id
                  ? 'text-[#1E1E1E] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1E1E1E]'
                  : ''
              }`}
            >
              {link.label}
              {link.id === 'compare' && comparedProducts.length > 0 && (
                <span className="ml-1 text-[10px] text-[#B88E2F] font-tabular">
                  ({comparedProducts.length})
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 Primary actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#4A4540] hover:text-[#1E1E1E] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer"
            title="Search mattresses"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => onNavigate(currentCustomer ? 'customer-dashboard' : 'products')}
            className="hidden sm:flex relative p-2 text-[#4A4540] hover:text-[#1E1E1E] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#B88E2F] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-tabular">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#1E1E1E] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="bg-[#1E1E1E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-tabular">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Account Button */}
          <div className="relative">
            {currentCustomer ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 bg-[#EFECE6] hover:bg-[#E6E1D8] text-[#1E1E1E] text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  <UserIcon size={14} />
                  <span className="max-w-[90px] truncate hidden md:inline">
                    {currentCustomer.name.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-[#EFECE6] text-[#78716C]">
                      Signed in as <span className="font-semibold text-[#1E1E1E] block truncate">{currentCustomer.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('customer-dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-[#3C3836] hover:bg-[#FAF8F5] transition-colors"
                    >
                      My Dashboard &amp; Orders
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('compare');
                      }}
                      className="w-full text-left px-3 py-2 text-[#3C3836] hover:bg-[#FAF8F5] transition-colors"
                    >
                      Compare Mattresses
                    </button>
                    <div className="border-t border-[#EFECE6] my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        customerLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="py-2 px-4 text-xs font-semibold text-white bg-[#1E1E1E] hover:bg-[#33312E] rounded-full transition-colors cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1E1E1E] hover:bg-[#EFECE6] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E3DC] bg-[#FAF9F5] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#EFECE6] text-[#1E1E1E] font-semibold'
                    : 'text-[#4A4540] hover:bg-[#F2EFE9]'
                }`}
              >
                {link.label}
              </button>
            ))}
            {currentCustomer ? (
              <button
                onClick={() => {
                  onNavigate('customer-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-medium text-[#1E1E1E] bg-[#E8DFD8]/50"
              >
                My Account &amp; Track Orders
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#1E1E1E]"
              >
                Customer Sign In / Register
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
