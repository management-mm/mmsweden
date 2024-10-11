import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { cn } from '@utils/cn';

const HomeLoader = () => {
  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
      <div className={cn('container', 'h-[100vh] w-full pt-[81px]')}>
        <div className="mb-[4px] h-[50px] w-[calc(100%-20px)]">
          <Skeleton height={'100%'} width={'100%'} />
        </div>
        <div className="mb-[12px] h-[50px] w-[200px]">
          <Skeleton height={'100%'} width={'100%'} />
        </div>
        <div className="mb-[48px] h-[23px] w-[240px]">
          <Skeleton height={'100%'} width={'100%'} />
        </div>
        <div className="md:flex">
          <div className="mb-[22px] h-[44px] w-[100%]">
            <Skeleton height={'100%'} width={'100%'} borderRadius={32} />
          </div>
          <div className="h-[44px] w-[100%]">
            <Skeleton height={'100%'} width={'100%'} borderRadius={32} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default HomeLoader;
