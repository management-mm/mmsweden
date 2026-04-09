'use client';

import Skeleton from 'react-loading-skeleton';

import clsx from 'clsx';

type Props = {
  mode: 'filters' | 'header' | 'mobile';
  itemsCount?: number;
};

export default function MobileCategoriesMenuSkeleton({
  mode,
  itemsCount = 6,
}: Props) {
  return (
    <div
      className={clsx(
        'w-full overflow-x-hidden',
        mode === 'filters' && 'h-[350px] overflow-y-scroll',
        mode === 'mobile' && 'overflow-visible'
      )}
    >
      {Array.from({ length: itemsCount }).map((_, index) => (
        <div
          key={index}
          className="border-b border-slate-200 bg-white px-[16px] py-[18px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton height={16} borderRadius={6} />
            </div>

            <div className="shrink-0">
              <Skeleton width={14} height={14} borderRadius={4} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
