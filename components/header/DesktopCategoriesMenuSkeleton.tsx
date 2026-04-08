'use client';

import Skeleton from 'react-loading-skeleton';

type Props = {
  showRightPanel?: boolean;
};

export default function DesktopCategoriesMenuSkeleton({
  showRightPanel = true,
}: Props) {
  return (
    <div className="flex gap-[32px] px-[20px] py-[24px] xl:gap-[40px]">
      <div className="border-r-secondary w-[340px] shrink-0 border-r pr-[24px] xl:w-[420px]">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="py-[18px] pr-[20px] pl-[16px]">
            <Skeleton height={18} borderRadius={6} />
          </div>
        ))}
      </div>

      {showRightPanel && (
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
      )}
    </div>
  );
}
