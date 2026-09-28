import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  showScore?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 14,
  showScore = false,
}) => {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center text-[#B88E2F]">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={`${
                filled
                  ? 'fill-[#B88E2F] text-[#B88E2F]'
                  : half
                  ? 'fill-[#B88E2F]/50 text-[#B88E2F]'
                  : 'text-[#D5CFC9]'
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-[#3C3836] font-tabular ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
