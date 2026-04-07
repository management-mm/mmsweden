import Skeleton from 'react-loading-skeleton';

const ProductPageSkeleton = () => {
  return (
    <div className="container pt-[12px] pb-[96px] md:pt-[22px] lg:pb-[124px]">
      <div className="flex flex-col gap-[30px] lg:flex-row">
        <div className="w-full lg:w-[50%]">
          <Skeleton height={400} className="mb-[12px]" />

          <div className="flex gap-[8px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} width={80} height={80} />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col lg:w-[50%]">
          <div className="mb-[12px]">
            <Skeleton height={28} width="70%" />
          </div>

          <div className="mb-[16px]">
            <Skeleton height={20} width="40%" />
          </div>

          <div className="mb-[16px] space-y-[8px]">
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="85%" />
            <Skeleton height={14} width="60%" />
          </div>

          <div className="mb-[24px] space-y-[8px]">
            <Skeleton height={14} width="50%" />
            <Skeleton height={14} width="45%" />
          </div>

          <div className="flex gap-[12px]">
            <Skeleton height={48} containerClassName="flex-1" />
            <Skeleton height={48} containerClassName="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
