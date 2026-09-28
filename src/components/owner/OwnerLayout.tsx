import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Layers,
  Boxes,
  Truck,
  Scale,
  Calculator,
  BedDouble,
  Cog,
  ShieldCheck,
  TrendingUp,
  Tag,
  MessageSquare,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OwnerLayoutProps {
  currentSection: string;
  onSelectSection: (section: string) => void;
  onExitToStore: () => void;
  children: React.ReactNode;
}

export const OwnerLayout: React.FC<OwnerLayoutProps> = ({
  currentSection,
  onSelectSection,
  onExitToStore,
  children,
}) => {
  const { currentOwner, ownerLogout, orders, rawMaterials, notifications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const lowStockCount = rawMaterials.filter((m) => m.currentStock <= m.reorderLevel).length;
  const unreadAlerts = notifications.filter((n) => n.audience === 'owner' && !n.read).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products Catalog', icon: Layers },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
    { id: 'raw-materials', label: 'Raw Materials', icon: Layers },
    { id: 'suppliers', label: 'Suppliers & Locations', icon: Truck },
    { id: 'supplier-comparison', label: 'Smart Procurement', icon: Scale },
    { id: 'cost-calculator', label: 'Cost Calculator', icon: Calculator },
    { id: 'ready-made', label: 'Ready-Made Mattresses', icon: BedDouble },
    { id: 'manufacturing', label: 'Manufacturing & BOM', icon: Cog },
    { id: 'quality-control', label: 'Quality Control', icon: ShieldCheck },
    { id: 'profit-reports', label: 'Profit & Reports', icon: TrendingUp },
    { id: 'coupons', label: 'Offers & Coupons', icon: Tag },
    { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EE] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#181615] text-[#DCD7D0] flex-col justify-between border-r border-[#2C2723] shrink-0 sticky top-0 h-screen">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand area */}
          <div className="p-5 border-b border-[#2C2723] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2E2823] border border-[#3E3630] flex items-center justify-center text-[#C9A96E]">
                <Shield size={16} />
              </div>
              <div>
                <span className="font-serif-display font-bold text-white text-base block leading-tight">
                  DreamNest ERP
                </span>
                <span className="text-[10px] text-[#A8A199] block font-mono">
                  MANUFACTURING PORTAL
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A96E] text-[#181615] font-bold shadow-xs'
                      : 'text-[#B0A9A0] hover:bg-[#25211E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-[#181615]' : 'text-[#8C847A]'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-tabular ${
                        isActive
                          ? 'bg-[#181615] text-[#C9A96E]'
                          : 'bg-[#2E2823] text-[#DCD7D0]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User profile & actions bottom */}
          <div className="p-4 border-t border-[#2C2723] bg-[#141211] text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block truncate max-w-[130px]">
                  {currentOwner?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#C9A96E] font-mono">
                  {currentOwner?.role || 'OWNER'}
                </span>
              </div>
              <button
                onClick={ownerLogout}
                className="p-1.5 rounded-lg text-[#8C847A] hover:text-rose-400 hover:bg-[#25211E] transition-colors cursor-pointer"
                title="Log out from ERP"
              >
                <LogOut size={16} />
              </button>
            </div>

            <button
              onClick={onExitToStore}
              className="w-full py-2 px-3 rounded-lg bg-[#25211E] hover:bg-[#2E2925] text-[11px] text-[#DCD7D0] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Customer Storefront</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-[#181615] text-white p-4 flex items-center justify-between sticky top-0 z-30 border-b border-[#2C2723]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#2E2823] flex items-center justify-center text-[#C9A96E]">
              <Shield size={14} />
            </div>
            <span className="font-serif-display font-bold text-sm">DreamNest ERP</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExitToStore}
              className="text-xs text-[#C9A96E] py-1 px-2.5 rounded bg-[#25211E] flex items-center gap-1"
            >
              <span>Store</span>
              <ExternalLink size={11} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#25211E] text-white"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#181615] text-[#DCD7D0] p-4 border-b border-[#2C2723] space-y-1 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                  currentSection === item.id
                    ? 'bg-[#C9A96E] text-[#181615] font-bold'
                    : 'text-[#B0A9A0] hover:bg-[#25211E]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] bg-[#2E2823] px-1.5 py-0.5 rounded text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <div className="pt-3 border-t border-[#2C2723]">
              <button
                onClick={ownerLogout}
                className="w-full py-2 text-left text-rose-400 font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Section Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
