import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AccessDenied } from './components/common/AccessDenied';

// Customer Components
import { HeroSection } from './components/customer/HeroSection';
import { ProductCard } from './components/customer/ProductCard';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { ComparisonView } from './components/customer/ComparisonView';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { CustomerLoginModal } from './components/customer/CustomerLoginModal';
import { CustomerDashboardView } from './components/customer/CustomerDashboardView';
import { AboutPage } from './components/customer/AboutPage';
import { ContactPage } from './components/customer/ContactPage';
import { OffersPage } from './components/customer/OffersPage';
import { SearchModal } from './components/customer/SearchModal';
import { BuyingGuideModal } from './components/customer/BuyingGuideModal';

// Owner Components
import { OwnerLogin } from './components/owner/OwnerLogin';
import { OwnerLayout } from './components/owner/OwnerLayout';
import { DashboardOverview } from './components/owner/sections/DashboardOverview';
import { OrdersManagement } from './components/owner/sections/OrdersManagement';
import { CustomerManagement } from './components/owner/sections/CustomerManagement';
import { ProductManagement } from './components/owner/sections/ProductManagement';
import { InventoryManagement } from './components/owner/sections/InventoryManagement';
import { RawMaterialsManagement } from './components/owner/sections/RawMaterialsManagement';
import { SupplierManagement } from './components/owner/sections/SupplierManagement';
import { SupplierComparison } from './components/owner/sections/SupplierComparison';
import { CostCalculator } from './components/owner/sections/CostCalculator';
import { ReadyMadeMattresses } from './components/owner/sections/ReadyMadeMattresses';
import { ManufacturingManagement } from './components/owner/sections/ManufacturingManagement';
import { QualityControl } from './components/owner/sections/QualityControl';
import { ProfitReports } from './components/owner/sections/ProfitReports';
import { CouponsManagement } from './components/owner/sections/CouponsManagement';
import { ReviewsModeration } from './components/owner/sections/ReviewsModeration';
import { NotificationsCenter } from './components/owner/sections/NotificationsCenter';
import { AdminSettings } from './components/owner/sections/AdminSettings';

import { Product, Order } from './types';
import { ArrowRight, BookOpen, SlidersHorizontal, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { products, currentOwner, currentCustomer, settings } = useApp();

  // Route State:
  // 'home' | 'products' | 'compare' | 'about' | 'contact' | 'offers' | 'customer-dashboard'
  // 'owner-login' | 'owner-dashboard'
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [ownerSection, setOwnerSection] = useState<string>('overview');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [buyingGuideOpen, setBuyingGuideOpen] = useState(false);

  // Products catalog filter state
  const [catalogCategory, setCatalogCategory] = useState<string>('All');
  const [catalogSort, setCatalogSort] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Sync route on URL hash / path popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path === 'owner-dashboard') {
        setCurrentRoute('owner-dashboard');
      } else if (path === 'owner-login') {
        setCurrentRoute('owner-login');
      } else if (path === 'customer-dashboard') {
        setCurrentRoute('customer-dashboard');
      } else if (path === 'products') {
        setCurrentRoute('products');
      } else if (path === 'about') {
        setCurrentRoute('about');
      } else if (path === 'contact') {
        setCurrentRoute('contact');
      } else if (path === 'offers') {
        setCurrentRoute('offers');
      } else if (path === 'compare') {
        setCurrentRoute('compare');
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', `/${route === 'home' ? '' : route}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ----------------------------------------------------
  // OWNER / RETAILER PORTAL ROUTING & STRICT PERMISSIONS
  // ----------------------------------------------------

  // Dedicated isolated login
  if (currentRoute === 'owner-login') {
    return (
      <OwnerLogin
        onSuccess={() => navigateTo('owner-dashboard')}
        onReturnToStore={() => navigateTo('home')}
      />
    );
  }

  // Protected Owner Dashboard route
  if (currentRoute === 'owner-dashboard') {
    // If not authenticated as an Owner or Staff role, strictly show 403 Access Denied
    if (!currentOwner || currentOwner.role === 'CUSTOMER') {
      return (
        <AccessDenied
          onReturnHome={() => navigateTo('home')}
          onGoToOwnerLogin={() => navigateTo('owner-login')}
        />
      );
    }

    return (
      <OwnerLayout
        currentSection={ownerSection}
        onSelectSection={setOwnerSection}
        onExitToStore={() => navigateTo('home')}
      >
        {ownerSection === 'overview' && (
          <DashboardOverview onNavigate={(sec) => setOwnerSection(sec)} />
        )}
        {ownerSection === 'orders' && <OrdersManagement />}
        {ownerSection === 'customers' && <CustomerManagement />}
        {ownerSection === 'products' && <ProductManagement />}
        {ownerSection === 'inventory' && <InventoryManagement />}
        {ownerSection === 'raw-materials' && <RawMaterialsManagement />}
        {ownerSection === 'suppliers' && (
          <SupplierManagement onNavigateToComparison={() => setOwnerSection('supplier-comparison')} />
        )}
        {ownerSection === 'supplier-comparison' && <SupplierComparison />}
        {ownerSection === 'cost-calculator' && <CostCalculator />}
        {ownerSection === 'ready-made' && <ReadyMadeMattresses />}
        {ownerSection === 'manufacturing' && <ManufacturingManagement />}
        {ownerSection === 'quality-control' && <QualityControl />}
        {ownerSection === 'profit-reports' && <ProfitReports />}
        {ownerSection === 'coupons' && <CouponsManagement />}
        {ownerSection === 'reviews' && <ReviewsModeration />}
        {ownerSection === 'notifications' && <NotificationsCenter />}
        {ownerSection === 'settings' && <AdminSettings />}
      </OwnerLayout>
    );
  }

  // ----------------------------------------------------
  // CUSTOMER PORTAL
  // ----------------------------------------------------

  // Filter products for Catalog view
  const filteredCatalogProducts = products.filter((p) => {
    if (catalogCategory === 'All') return true;
    return p.category === catalogCategory;
  }).sort((a, b) => {
    if (catalogSort === 'price_low') return a.basePrice - b.basePrice;
    if (catalogSort === 'price_high') return b.basePrice - a.basePrice;
    if (catalogSort === 'rating') return b.ratings.quality - a.ratings.quality;
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F5] text-[#1E1E1E]">
      {/* Top Header */}
      <Header
        currentTab={currentRoute}
        onNavigate={navigateTo}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {currentRoute === 'home' && (
          <div className="space-y-16 lg:space-y-24">
            {/* Hero Section */}
            <HeroSection
              onShopClick={() => navigateTo('products')}
              onExploreClick={() => {
                const el = document.getElementById('featured-collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectCategory={(cat) => {
                setCatalogCategory(cat);
                navigateTo('products');
              }}
            />

            {/* Featured Best Sellers Section */}
            <section id="featured-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                    <span>Factory Direct Best Sellers</span>
                    <span aria-hidden="true">·</span>
                    <span>10-Year Sag Proof</span>
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-1">
                    Most Popular Sleep Systems
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setBuyingGuideOpen(true)}
                    className="text-xs font-semibold text-[#524E48] hover:text-[#1E1E1E] flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[#F2EDE4]"
                  >
                    <BookOpen size={14} className="text-[#B88E2F]" />
                    <span>Mattress Buying Guide</span>
                  </button>

                  <button
                    onClick={() => navigateTo('products')}
                    className="py-2.5 px-4 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View All ({products.length})</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products
                  .filter((p) => p.isBestSeller || p.isFeatured)
                  .slice(0, 6)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
              </div>
            </section>

            {/* New Arrivals & Custom Size Highlight */}
            <section className="bg-white border-y border-[#E8E3DC] py-16 lg:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-wider">
                      Tailored Custom Engineering
                    </span>
                    <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-1">
                      New Arrivals &amp; Custom Sized Mattresses
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      const bespoke = products.find((p) => p.category === 'Custom Size');
                      if (bespoke) setSelectedProduct(bespoke);
                    }}
                    className="py-2.5 px-5 bg-[#FAF8F5] border border-[#D5CFC9] hover:bg-[#EFECE6] text-[#1E1E1E] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Customize to Your Cot (CNC Cut)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products
                    .filter((p) => p.isNewArrival || p.category === 'Natural Latex' || p.category === 'Luxury Hybrid')
                    .slice(0, 3)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProduct(p)}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* Why Choose Us & Craftsmanship Pillars */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#8C7A6B]">
                  Uncompromising Standards
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1E1E1E]">
                  Why Sleep on a DreamNest Mattress?
                </h2>
                <p className="text-xs sm:text-sm text-[#66615C] leading-relaxed">
                  Every layer is cold-laminated and inspected with 8-point physical QC metrics in Cherlapally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E8E3DC] rounded-3xl p-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F] font-serif-display font-bold text-lg">
                    1
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
                    Medical Grade Foam Density
                  </h3>
                  <p className="text-xs text-[#524E48] leading-relaxed">
                    While market mattresses cut costs with 28D/32D foam, we use authentic 55D gel memory and 70D bonded orthopedic substrates that prevent sagging for 10+ years.
                  </p>
                </div>

                <div className="bg-white border border-[#E8E3DC] rounded-3xl p-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F] font-serif-display font-bold text-lg">
                    2
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
                    Zero Middleman Commission
                  </h3>
                  <p className="text-xs text-[#524E48] leading-relaxed">
                    By eliminating showroom rents, distributor networks, and retail markups, we pass 40% direct cost savings to you in the form of superior materials.
                  </p>
                </div>

                <div className="bg-white border border-[#E8E3DC] rounded-3xl p-7 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E3DC] flex items-center justify-center text-[#B88E2F] font-serif-display font-bold text-lg">
                    3
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">
                    100 Nights Risk-Free Trial
                  </h3>
                  <p className="text-xs text-[#524E48] leading-relaxed">
                    Sleep on your new DreamNest in your own bedroom for up to 100 nights. If it's not the best rest you've ever had, we'll pick it up with a full 100% refund.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCTS CATALOG */}
        {currentRoute === 'products' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E8E3DC]">
              <div>
                <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-wider">
                  Engineered Mattresses &amp; Sleep Solutions
                </span>
                <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-1">
                  Full Mattress Collection ({filteredCatalogProducts.length})
                </h1>
              </div>

              {/* Sorting and Filter controls */}
              <div className="flex items-center gap-3">
                <select
                  value={catalogSort}
                  onChange={(e) => setCatalogSort(e.target.value as any)}
                  className="py-2 px-3 bg-white border border-[#D5CFC9] rounded-xl text-xs font-semibold text-[#1E1E1E] focus:outline-[#1E1E1E]"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Top Quality Rating</option>
                </select>

                <button
                  onClick={() => setBuyingGuideOpen(true)}
                  className="py-2 px-3.5 bg-white border border-[#D5CFC9] hover:bg-[#FAF8F5] text-xs font-semibold rounded-xl text-[#1E1E1E] flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen size={14} className="text-[#B88E2F]" />
                  <span>Buying Guide</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              {[
                'All',
                'Orthopedic',
                'Memory Foam',
                'Natural Latex',
                'Luxury Hybrid',
                'Pocket Spring',
                'Bonnell Spring',
                'Budget Comfort',
                'Custom Size',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategory(cat)}
                  className={`py-2 px-4 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
                    catalogCategory === cat
                      ? 'bg-[#1E1E1E] text-white shadow-xs'
                      : 'bg-white border border-[#E2DDD5] text-[#524E48] hover:border-[#1E1E1E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCatalogProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCT COMPARISON */}
        {currentRoute === 'compare' && (
          <ComparisonView
            onSelectProduct={(p) => setSelectedProduct(p)}
            onBrowseMore={() => navigateTo('products')}
          />
        )}

        {/* VIEW 4: CUSTOMER DASHBOARD */}
        {currentRoute === 'customer-dashboard' && (
          <CustomerDashboardView
            onBrowseProducts={() => navigateTo('products')}
            onOpenProduct={(id) => {
              const p = products.find((prod) => prod.id === id);
              if (p) setSelectedProduct(p);
            }}
          />
        )}

        {/* VIEW 5: ABOUT */}
        {currentRoute === 'about' && (
          <AboutPage onShopClick={() => navigateTo('products')} />
        )}

        {/* VIEW 6: CONTACT */}
        {currentRoute === 'contact' && <ContactPage />}

        {/* VIEW 7: OFFERS */}
        {currentRoute === 'offers' && (
          <OffersPage onShopClick={() => navigateTo('products')} />
        )}
      </main>

      {/* Customer Footer */}
      <Footer
        onNavigate={navigateTo}
        onGoToOwnerLogin={() => navigateTo('owner-login')}
      />

      {/* Modals & Slide-out Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCart={() => setCartOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onProceedToCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCompleted={(order) => {
          navigateTo('customer-dashboard');
        }}
      />

      <CustomerLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => navigateTo('customer-dashboard')}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <BuyingGuideModal
        isOpen={buyingGuideOpen}
        onClose={() => setBuyingGuideOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
