import { useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import DecorativeLine from '@components/common/DecorativeLine';
import ProductCard from '@components/common/ProductCard';
import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const LatestArrivals = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    console.log(sliderRef);
    if (!sliderRef.current) return;

    sliderRef.current.swiper.slideNext();
  }, []);
  return (
    <section className="pb-[96px] pt-[48px] text-primary">
      <div className="container">
        <div className="relative mb-[22px] flex items-end justify-between">
          <h2 className="text-[18px] font-semibold md:text-[24px] md:leading-[0.8]">
            Latest arrivals
          </h2>
          <DecorativeLine intent="latestArrivals" />
          <div className="flex gap-[12px]">
            <div
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line"
              onClick={handlePrev}
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowLeft}
                size={{ width: 13, height: 18 }}
              />
            </div>
            <div
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line"
              onClick={handleNext}
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowRight}
                size={{ width: 13, height: 18 }}
              />
            </div>
          </div>
        </div>

        <Swiper
          ref={sliderRef}
          style={{ width: 'calc(49% + 50vw)' }}
          slidesPerView={'auto'}
          spaceBetween={'10px'}
          className="slider"
          breakpoints={{
            768: {
              spaceBetween: 30,
            },
          }}
        >
          <SwiperSlide className="w-fit" style={{ width: 'fit-content' }}>
            <ProductCard />
          </SwiperSlide>
          <SwiperSlide style={{ width: 'fit-content' }}>
            <ProductCard />
          </SwiperSlide>
          <SwiperSlide style={{ width: 'fit-content' }}>
            <ProductCard />
          </SwiperSlide>
          <SwiperSlide style={{ width: 'fit-content' }}>
            <ProductCard />
          </SwiperSlide>
          <SwiperSlide style={{ width: 'fit-content' }}>
            <ProductCard />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default LatestArrivals;
