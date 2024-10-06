import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';

const Slider = () => {
  return (
    <Swiper
      style={{ width: 'calc(49% + 50vw)' }}
      slidesPerView={'auto'}
      spaceBetween={'10px'}
      className="slider"
      loop={true}
      modules={[Scrollbar]}
      scrollbar={true}
      breakpoints={{
        768: {
          spaceBetween: 30,
        },
      }}
      centeredSlides={true}
      onSwiper={swiper => console.log(swiper)}
    >
      {Array.from({ length: 6 }).map((_, index) => {
        return (
          <SwiperSlide key={index * 3.45}>
            <div className="block h-[200px] w-[330px] bg-slate-500 md:h-[362px] md:w-[580px] lg:h-[480px] lg:w-[754px]" />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;
