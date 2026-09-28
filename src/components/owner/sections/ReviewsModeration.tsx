import React from 'react';
import { MessageSquare, Check, X, Star } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { RatingStars } from '../../common/RatingStars';

export const ReviewsModeration: React.FC = () => {
  const { reviews, toggleReviewApproval } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
            Customer Feedback &amp; Social Proof Integrity
          </span>
          <h1 className="font-serif-display text-3xl font-bold text-[#1E1E1E] mt-1">
            Customer Review Moderation ({reviews.length})
          </h1>
        </div>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E8E3DC] text-[#8C7A6B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Product Model</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Title &amp; Comment</th>
                <th className="py-3.5 px-4">Moderation Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4 text-[#78716C] font-mono">{rev.date}</td>
                  <td className="py-3 px-4 font-semibold text-[#1E1E1E]">{rev.productName}</td>
                  <td className="py-3 px-4 text-[#524E48]">
                    <span className="font-medium text-[#1E1E1E] block">{rev.customerName}</span>
                    <span className="text-[10px] text-[#78716C]">{rev.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4">
                    <RatingStars rating={rev.rating} size={12} showScore />
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <strong className="text-[#1E1E1E] block">{rev.title}</strong>
                    <p className="text-[11px] text-[#524E48] leading-relaxed line-clamp-2">
                      {rev.comment}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        rev.isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {rev.isApproved ? 'Published on Store' : 'Pending Approval'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleReviewApproval(rev.id)}
                      className={`py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                        rev.isApproved
                          ? 'bg-[#FAF8F5] hover:bg-rose-50 text-rose-700 border border-[#D5CFC9]'
                          : 'bg-[#1E1E1E] text-white hover:bg-[#33312E]'
                      }`}
                    >
                      {rev.isApproved ? 'Unpublish' : 'Approve Review'}
                    </button>
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
