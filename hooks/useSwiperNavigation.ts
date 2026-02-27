import { useCallback, useRef } from 'react';

import { type Swiper as SwiperCore } from 'swiper/types';

interface UseSwiperNavigation {
  handlePrev: () => void;
  handleNext: () => void;
  onSwiperInit: (swiper: SwiperCore) => void;
}

const useSwiperNavigation = (): UseSwiperNavigation => {
  const swiperRef = useRef<SwiperCore | null>(null);

  const handlePrev = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);

  const onSwiperInit = useCallback((swiper: SwiperCore) => {
    swiperRef.current = swiper;
  }, []);

  return {
    handlePrev,
    handleNext,
    onSwiperInit,
  };
};

export default useSwiperNavigation;
