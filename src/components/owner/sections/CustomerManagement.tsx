import React, { useState } from 'react';
import { Users, Search, Phone, Mail, MapPin, ShoppingBag, Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { User } from '../../../types';

export const CustomerManagement: React.FC = () => {
  const { orders, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract customers from orders & registered users
  const customerMap = new Map<string, {
    name: string;
    email: string;
    mobile: string;
    ordersCount: number;
    totalSpent: number;
    lastOrderDate: string;
    city: string;
    state: string;
  }>();

  orders.forEach((o) => {
    const key = o.customerEmail || o.customerName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.total;
      if (new Date(o.orderDate) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.orderDate;
      }
    } else {
      customerMap.set(key, {
        name: o.customerName,
        email: o.customerEmail,
        mobile: o.customerMobile,
        ordersCount: 1,
        totalSpent: o.total,
        lastOrderDate: o.orderDate,
        city: o.shippingAddress?.city || 'Hyderabad',
        state: o.shippingAddress?.state || 'Telangana',
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter(
    (c) =>
      searchTerm.trim() === '' ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Client Accounts &amp; Lifetime Value
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Customer Directory ({customerList.length})
          </h1>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-[#8C7A6B]" />
          <input
            type="text"
            placeholder="Search customers by name, city or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 bg-white border border-[#D5CFC9] rounded-xl text-xs focus:outline-[#1E1E1E] w-64"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Order</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {customerList.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#1E1E1E]">
                    {c.name}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-[11px] text-[#524E48] space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-[#8C7A6B]" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-[#8C7A6B]" />
                        <span>{c.mobile}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#524E48]">
                    {c.city}, {c.state}
                  </td>

                  <td className="py-3 px-4 font-bold text-[#1E1E1E] font-tabular">
                    {c.ordersCount} orders
                  </td>

                  <td className="py-3 px-4 font-bold text-emerald-800 font-tabular">
                    {settings.currencySymbol}{c.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-[#78716C] font-tabular">
                    {new Date(c.lastOrderDate).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active Customer
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
