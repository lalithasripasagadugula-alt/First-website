import React, { useState } from 'react';
import {
  Package,
  Heart,
  MapPin,
  Bell,
  Headphones,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';

interface CustomerDashboardViewProps {
  onBrowseProducts: () => void;
  onOpenProduct: (productId: string) => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  onBrowseProducts,
  onOpenProduct,
}) => {
  const {
    currentCustomer,
    customerLogout,
    orders,
    wishlist,
    products,
    notifications,
    markNotificationRead,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'notifications' | 'support'>('orders');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  if (!currentCustomer) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="font-serif-display text-2xl font-bold text-[#1E1E1E]">Please Sign In</h2>
        <p className="text-xs text-[#78716C] mt-2 mb-6">
          Sign in to your customer account to view your live mattress manufacturing orders and saved addresses.
        </p>
        <button
          onClick={onBrowseProducts}
          className="py-2.5 px-6 bg-[#1E1E1E] text-white text-xs font-semibold rounded-xl"
        >
          Return to Store
        </button>
      </div>
    );
  }

  // Filter orders placed by this customer (or all demo orders for exploration)
  const myOrders = orders.filter(
    (o) => o.customerId === currentCustomer.id || o.customerEmail === currentCustomer.email
  );

  const customerNotifications = notifications.filter(
    (n) => n.audience === 'customer' && (!n.userId || n.userId === currentCustomer.id)
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // The 9 sequential delivery stages for the timeline
  const ORDER_STAGES: OrderStatus[] = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Manufacturing',
    'Quality Check',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStageIndex = (status: OrderStatus) => {
    return ORDER_STAGES.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Customer Header Bar */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F0EBE3] border border-[#E2DDD5] flex items-center justify-center text-xl font-bold text-[#1E1E1E] font-serif-display">
            {currentCustomer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-display text-2xl font-bold text-[#1E1E1E]">
                {currentCustomer.name}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#F2EDE4] text-[#8C7A6B] px-2 py-0.5 rounded-md">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              {currentCustomer.email} · {currentCustomer.mobile}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('support')}
            className="py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#D5CFC9] rounded-xl text-xs font-semibold text-[#1E1E1E] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Headphones size={14} />
            <span>Support Helpline</span>
          </button>
          <button
            onClick={customerLogout}
            className="py-2.5 px-4 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E3DC] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'orders'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          <Package size={15} />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'wishlist'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          <Heart size={15} />
          <span>Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          <MapPin size={15} />
          <span>Saved Addresses ({currentCustomer.addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-3 px-4 text-xs font-semibold rounded-t-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'notifications'
              ? 'bg-white border-t-2 border-[#1E1E1E] text-[#1E1E1E] shadow-xs'
              : 'text-[#78716C] hover:text-[#1E1E1E]'
          }`}
        >
          <Bell size={15} />
          <span>Updates &amp; Alerts ({customerNotifications.filter((n) => !n.read).length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {myOrders.length === 0 ? (
            <div className="bg-white border border-[#E8E3DC] rounded-3xl p-12 text-center space-y-3">
              <Package size={32} className="mx-auto text-[#8C7A6B]" />
              <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">No Orders Found</h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                You haven't placed an order yet. Configure your personalized mattress with our size and firmness guide.
              </p>
              <button
                onClick={onBrowseProducts}
                className="mt-3 py-2.5 px-6 bg-[#1E1E1E] text-white text-xs font-semibold rounded-xl"
              >
                Browse Mattresses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Order Cards List */}
              <div className="lg:col-span-5 space-y-4">
                {myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderForTracking(ord)}
                    className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all ${
                      selectedOrderForTracking?.id === ord.id
                        ? 'border-[#1E1E1E] shadow-md ring-1 ring-[#1E1E1E]'
                        : 'border-[#E8E3DC] hover:border-[#D5CFC9]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#1E1E1E]">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-[#78716C] block">
                          Placed on {new Date(ord.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E3DC] text-[#1E1E1E]">
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="py-3 space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover bg-[#F4F1EC]"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <h4 className="font-semibold text-[#1E1E1E] truncate">{item.productName}</h4>
                            <p className="text-[11px] text-[#78716C]">
                              {item.size} · {item.thickness}" · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] text-[#78716C]">Total Paid:</span>
                        <span className="ml-1 font-bold font-tabular text-[#1E1E1E]">
                          {settings.currencySymbol}{ord.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8C7A6B] flex items-center gap-1 font-semibold">
                        <span>View Progress</span>
                        <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Detail & Live Timeline View */}
              <div className="lg:col-span-7">
                {selectedOrderForTracking ? (
                  <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EFECE6]">
                      <div>
                        <span className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-wider">
                          Live Manufacturing &amp; Logistics Tracking
                        </span>
                        <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-0.5">
                          Order #{selectedOrderForTracking.orderNumber}
                        </h3>
                        <p className="text-xs text-[#78716C] mt-0.5">
                          Assigned Factory: Cherlapally Plant (Line 1) · Expected Delivery: {selectedOrderForTracking.expectedDeliveryDate}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-[#1E1E1E] font-tabular">
                          {settings.currencySymbol}{selectedOrderForTracking.total.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-emerald-700 block font-semibold">
                          Payment: {selectedOrderForTracking.paymentMethod} (Verified)
                        </span>
                      </div>
                    </div>

                    {/* Visual 9-Stage Stepper */}
                    <div>
                      <h4 className="text-xs uppercase font-semibold text-[#1E1E1E] tracking-wider mb-4">
                        Manufacturing &amp; Fulfillment Milestones
                      </h4>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E3DC]">
                        {ORDER_STAGES.map((st, index) => {
                          const currentIndex = getStageIndex(selectedOrderForTracking.orderStatus);
                          const isDone = index <= currentIndex;
                          const isCurrent = index === currentIndex;

                          // Find event note if available
                          const matchEvent = selectedOrderForTracking.trackingHistory.find(
                            (h) => h.status === st
                          );

                          return (
                            <div key={st} className="relative flex items-start gap-4 text-xs">
                              {/* Circle indicator */}
                              <div
                                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                  isDone
                                    ? 'bg-[#1E1E1E] text-white ring-4 ring-[#FAF8F5]'
                                    : 'bg-[#E5E0D8] text-transparent'
                                }`}
                              >
                                {isDone && <CheckCircle2 size={12} />}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`font-semibold ${
                                      isCurrent
                                        ? 'text-[#1E1E1E] text-sm font-bold'
                                        : isDone
                                        ? 'text-[#1E1E1E]'
                                        : 'text-[#9E9790]'
                                    }`}
                                  >
                                    {st}
                                    {isCurrent && (
                                      <span className="ml-2 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase font-semibold">
                                        Active Phase
                                      </span>
                                    )}
                                  </span>

                                  {matchEvent && (
                                    <span className="text-[11px] text-[#8C7A6B] font-tabular">
                                      {new Date(matchEvent.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}{' '}
                                      · {new Date(matchEvent.timestamp).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                {matchEvent && (
                                  <p className="text-[11px] text-[#66615C] mt-0.5 leading-relaxed">
                                    {matchEvent.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shipping Address & Help */}
                    <div className="pt-6 border-t border-[#EFECE6] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#524E48]">
                      <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4 space-y-1">
                        <span className="font-semibold text-[#1E1E1E] block">Destination Address:</span>
                        <p>{selectedOrderForTracking.shippingAddress.fullName}</p>
                        <p>{selectedOrderForTracking.shippingAddress.line1}</p>
                        <p>
                          {selectedOrderForTracking.shippingAddress.city},{' '}
                          {selectedOrderForTracking.shippingAddress.state} -{' '}
                          {selectedOrderForTracking.shippingAddress.pincode}
                        </p>
                        <p className="text-[#8C7A6B] pt-1">
                          Phone: {selectedOrderForTracking.shippingAddress.mobile}
                        </p>
                      </div>

                      <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4 space-y-1">
                        <span className="font-semibold text-[#1E1E1E] block">Warranty &amp; Care:</span>
                        <p>· 10-Year Sag-Proof Factory Warranty registered with Order #{selectedOrderForTracking.orderNumber}</p>
                        <p>· 100-Night Sleep Trial begins from delivery confirmation.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-[#E8E3DC] rounded-3xl p-12 text-center space-y-2">
                    <p className="text-sm font-semibold text-[#1E1E1E]">Select an order to track</p>
                    <p className="text-xs text-[#78716C]">
                      Click on any order on the left to see live factory cutting, lamination, quality checks, and transit milestones.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="bg-white border border-[#E8E3DC] rounded-3xl p-12 text-center space-y-3">
              <Heart size={30} className="mx-auto text-[#8C7A6B]" />
              <h3 className="font-serif-display text-xl font-bold text-[#1E1E1E]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#78716C]">Save mattresses you'd like to compare or purchase later.</p>
              <button
                onClick={onBrowseProducts}
                className="mt-3 py-2.5 px-6 bg-[#1E1E1E] text-white text-xs font-semibold rounded-xl"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#E8E3DC] rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F1EC] mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#78716C] uppercase font-semibold">
                      {p.category}
                    </span>
                    <h4 className="font-semibold text-sm text-[#1E1E1E] mt-0.5 line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-[#524E48] mt-1 font-bold font-tabular">
                      {settings.currencySymbol}
                      {(p.basePrice * (1 - p.discountPercent / 100)).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenProduct(p.id)}
                    className="mt-4 w-full py-2 bg-[#1E1E1E] hover:bg-[#33312E] text-white text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    View &amp; Customize
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentCustomer.addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-[#E8E3DC] rounded-2xl p-5 text-xs text-[#524E48] space-y-1.5 shadow-xs relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1E1E1E]">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Default Address
                  </span>
                )}
              </div>
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-[#8C7A6B] pt-1">Mobile: {addr.mobile}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {customerNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border transition-colors cursor-pointer text-xs ${
                notif.read
                  ? 'bg-white border-[#E8E3DC] text-[#78716C]'
                  : 'bg-[#FAF8F5] border-[#1E1E1E]/30 text-[#1E1E1E] font-medium shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{notif.title}</span>
                <span className="text-[11px] text-[#8C7A6B] font-tabular">
                  {new Date(notif.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-[#524E48]">{notif.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: SUPPORT */}
      {activeTab === 'support' && (
        <div className="bg-white border border-[#E8E3DC] rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E]">
              Factory Customer Care &amp; Warranty Assistance
            </h3>
            <p className="text-xs text-[#78716C] mt-1">
              Have questions regarding your custom mattress dimensions or delivery timeline? Our Cherlapally support desk is available Monday through Saturday.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4 space-y-1">
              <span className="font-semibold text-[#1E1E1E] block">Telephone Helpline:</span>
              <p className="text-sm font-bold text-[#1E1E1E]">{settings.supportPhone}</p>
              <p className="text-[#78716C]">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E8E3DC] rounded-2xl p-4 space-y-1">
              <span className="font-semibold text-[#1E1E1E] block">Email Support:</span>
              <p className="text-sm font-bold text-[#1E1E1E]">{settings.supportEmail}</p>
              <p className="text-[#78716C]">Average response time: &lt; 3 hours</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
