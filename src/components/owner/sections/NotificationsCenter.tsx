import React from 'react';
import { Bell, Check, ShoppingBag, Boxes, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const NotificationsCenter: React.FC = () => {
  const { notifications, markNotificationRead } = useApp();

  const ownerNotifs = notifications.filter((n) => n.audience === 'owner');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Automated Operational Broadcasts
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Enterprise Activity &amp; Alerts ({ownerNotifs.length})
          </h1>
        </div>
      </div>

      <div className="space-y-3">
        {ownerNotifs.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`bg-white border rounded-2xl p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors shadow-xs ${
              n.read ? 'border-[#E8E3DC] opacity-80' : 'border-[#1E1E1E]/40 ring-1 ring-[#1E1E1E]/20'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'order'
                    ? 'bg-blue-50 text-blue-700'
                    : n.type === 'inventory'
                    ? 'bg-rose-50 text-rose-700'
                    : n.type === 'qc'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {n.type === 'order' && <ShoppingBag size={18} />}
                {n.type === 'inventory' && <Boxes size={18} />}
                {n.type === 'qc' && <ShieldCheck size={18} />}
                {n.type === 'promo' && <Bell size={18} />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#1E1E1E]">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                  )}
                </div>
                <p className="text-xs text-[#524E48] mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-[#8C7A6B] font-tabular mt-1 block">
                  {new Date(n.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {!n.read && (
              <span className="text-[11px] font-semibold text-[#8C7A6B] hover:text-[#1E1E1E]">
                Mark read
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
