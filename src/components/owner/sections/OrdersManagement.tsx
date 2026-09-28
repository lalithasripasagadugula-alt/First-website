import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Eye,
  Edit3,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Order, OrderStatus } from '../../../types';

export const OrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [statusNotes, setStatusNotes] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const ALL_STATUSES: OrderStatus[] = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Manufacturing',
    'Quality Check',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, statusNotes);
    setShowStatusModal(false);
    setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Order Management &amp; Factory Execution
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Customer Manufacturing Orders ({orders.length})
          </h1>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-[#8C7A6B]" />
            <input
              type="text"
              placeholder="Search by order #, customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 bg-white border border-[#D5CFC9] rounded-xl text-xs focus:outline-[#1E1E1E] w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-white border border-[#D5CFC9] rounded-xl text-xs focus:outline-[#1E1E1E]"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Products &amp; Specs</th>
                <th className="py-3.5 px-4">Value</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Manufacturing Status</th>
                <th className="py-3.5 px-4">Expected Date</th>
                <th className="py-3.5 px-4">Gross Profit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#78716C]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1E1E1E]">
                      #{ord.orderNumber}
                      <span className="block text-[10px] text-[#78716C] font-normal">
                        {new Date(ord.orderDate).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1E1E1E] block">{ord.customerName}</span>
                      <span className="text-[11px] text-[#78716C] block">{ord.customerMobile}</span>
                      <span className="text-[10px] text-[#8C7A6B] truncate max-w-[140px] block">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="font-medium text-[#1E1E1E] block line-clamp-1">
                            {i.productName}
                          </span>
                          <span className="text-[11px] text-[#78716C]">
                            {i.size} · {i.thickness}" · Qty: {i.quantity}
                            {i.isCustom && ' (Custom CNC)'}
                          </span>
                        </div>
                      ))}
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1E1E1E] font-tabular">
                      {settings.currencySymbol}{ord.total.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-emerald-800 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] block w-fit">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border inline-block ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ord.orderStatus === 'Manufacturing' || ord.orderStatus === 'Quality Check'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-[#FAF8F5] text-[#1E1E1E] border-[#E8E3DC]'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#524E48] font-tabular">
                      {ord.expectedDeliveryDate}
                    </td>

                    <td className="py-3 px-4 text-emerald-700 font-bold font-tabular">
                      +{settings.currencySymbol}{ord.estimatedProfit.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(ord)}
                        className="py-1.5 px-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Update Stage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Update Order Status & Sync Timeline */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-[#E5E0D8] rounded-3xl shadow-2xl p-6 sm:p-8 my-auto">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EFECE6] flex items-center justify-center text-[#4A4540] cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7A6B]">
                Production &amp; Logistics Control
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-[#1E1E1E] mt-1">
                Advance Order #{selectedOrder.orderNumber}
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Updating this stage immediately notifies customer {selectedOrder.customerName} in their live dashboard.
              </p>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Select New Phase</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2.5 font-semibold text-xs focus:outline-[#1E1E1E]"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#524E48] block mb-1 font-semibold">Factory / Courier Milestone Notes</label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="e.g. Foam core lamination complete. Assigned to Cherlapally line 2 for tape-edge binding..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CFC9] rounded-xl px-3 py-2 text-xs focus:outline-[#1E1E1E]"
                />
              </div>

              <div className="bg-[#FAF9F5] border border-[#E8E3DC] rounded-xl p-3 text-[11px] text-[#78716C]">
                <span>Customer Notifications: An instant notification will be dispatched to customer's dashboard and order timeline.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1E1E] hover:bg-[#33312E] text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Apply Stage &amp; Sync Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
