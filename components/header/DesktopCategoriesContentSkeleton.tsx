'use client';

import Skeleton from 'react-loading-skeleton';

export default function DesktopCategoriesContentSkeleton() {
  return (
    <div className="min-w-0 flex-1 pt-[24px]">
      <div className="mb-[32px] max-w-[240px]">
        <Skeleton height={28} borderRadius={8} />
      </div>

      <div className="grid grid-cols-2 gap-x-[18px]">
        <div className="min-w-0">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="py-[8px] pl-[16px]">
              <Skeleton height={18} borderRadius={6} />
            </div>
          ))}
        </div>

        <div className="min-w-0">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="py-[8px] pl-[16px]">
              <Skeleton height={18} borderRadius={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
