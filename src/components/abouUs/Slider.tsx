import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar, Autoplay } from 'swiper/modules';
import photosAboutUsList from '@constants/photosAboutUsList';

const Slider = () => {
  return (
    <Swiper
      style={{ width: 'calc(49% + 50vw)' }}
      slidesPerView={'auto'}
      spaceBetween={'10px'}
      className="slider"
      loop={true}
      modules={[Scrollbar, Autoplay]}
      scrollbar={true}
      autoplay={{
        delay: 2000,
          disableOnInteraction: true,
        }}
      breakpoints={{
        768: {
          spaceBetween: 30,
        },
      }}
      centeredSlides={true}
      onSwiper={swiper => console.log(swiper)}
    >
      {photosAboutUsList.map((photo, index) => {
        const {mobile, mobile2x, mobile3x, tablet, tablet2x, tablet3x, desktop, desktop2x, desktop3x, alt} = photo
        return (
          <SwiperSlide key={index * 3.45}>
            <picture>
            <source
              srcSet={`src/assets/images/about-us/${desktop} 1x, src/assets/images/about-us/${desktop2x} 2x, src/assets/images/about-us/${desktop3x} 3x`}
              media="(min-width: 1178px)"
              type="image/webp"
            />

            <source
              srcSet={`src/assets/images/about-us/${tablet} 1x, src/assets/images/about-us/${tablet2x} 2x, src/assets/images/about-us/${tablet3x} 3x`}
              media="(min-width: 768px)"
              type="image/webp"
            />
            <source
              srcSet={`src/assets/images/about-us/${mobile} 1x, src/assets/images/about-us/${mobile2x} 2x, src/assets/images/about-us/${mobile3x} 3x`}
              media="(max-width: 767px)"
              type="image/webp"
            />
            <img
              src={`src/assets/images/about-us/${mobile}`}
              alt={alt}
              width={330}
              className="block rounded-[4px] h-[200px] w-[330px] bg-slate-500 md:h-[362px] md:w-[580px] lg:h-[480px] lg:w-[754px]"
            />
          </picture>
            {/* <div className="block h-[200px] w-[290px] bg-slate-500 md:h-[362px] md:w-[580px] lg:h-[480px] lg:w-[754px]" /> */}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;