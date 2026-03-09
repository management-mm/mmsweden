'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { Autoplay, Scrollbar } from 'swiper/modules';

import photosAboutUsList from '@constants/photosAboutUsList';

const Slider = () => {
  return (
    <Swiper
      style={{ width: 'calc(49% + 50vw)' }}
      slidesPerView="auto"
      spaceBetween={10}
      className="slider"
      loop
      modules={[Scrollbar, Autoplay]}
      scrollbar
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
      }}
      breakpoints={{
        768: { spaceBetween: 30 },
      }}
      centeredSlides
    >
      {photosAboutUsList.map((photo, index) => {
        const { mobile, tablet, desktop, alt } = photo;

        return (
          <SwiperSlide key={`${alt}-${index}`}>
            <div className="md:hidden">
              <Image
                src={mobile}
                alt={alt}
                width={330}
                height={200}
                className="block h-[200px] w-[330px] rounded-[4px] bg-slate-500 object-cover"
              />
            </div>

            <div className="hidden md:block lg:hidden">
              <Image
                src={tablet}
                alt={alt}
                width={580}
                height={362}
                className="block h-[362px] w-[580px] rounded-[4px] bg-slate-500 object-cover"
              />
            </div>

            <div className="hidden lg:block">
              <Image
                src={desktop}
                alt={alt}
                width={754}
                height={480}
                className="block h-[480px] w-[754px] rounded-[4px] bg-slate-500 object-cover"
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;