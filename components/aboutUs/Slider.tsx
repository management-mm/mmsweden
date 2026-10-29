'use client';

import { Swiper, SwiperSlide } from 'swiper/react';

import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Autoplay, Scrollbar } from 'swiper/modules';

import styles from './Slider.module.css';

import photosAboutUsList from '@constants/photosAboutUsList';

const Slider = () => {
  return (
    <div className={styles.wrapper}>
      <Swiper
        modules={[Scrollbar, Autoplay]}
        className={styles.slider}
        slidesPerView="auto"
        centeredSlides
        spaceBetween={10}
        loop={photosAboutUsList.length >= 3}
        speed={600}
        scrollbar={{
          draggable: true,
          hide: false,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          768: {
            spaceBetween: 30,
          },
        }}
      >
        {photosAboutUsList.map((photo, index) => {
          const { mobile, tablet, desktop, alt } = photo;

          return (
            <SwiperSlide key={`${alt}-${index}`} className={styles.slide}>
              {/* Mobile */}
              <div className={styles.mobileImage}>
                <Image
                  src={mobile}
                  alt={alt}
                  width={330}
                  height={200}
                  sizes="(max-width: 767px) 100vw, 330px"
                  className={styles.image}
                />
              </div>

              {/* Tablet */}
              <div className={styles.tabletImage}>
                <Image
                  src={tablet}
                  alt={alt}
                  width={580}
                  height={362}
                  sizes="(min-width: 768px) and (max-width: 1023px) 580px, 100vw"
                  className={styles.image}
                />
              </div>

              {/* Desktop */}
              <div className={styles.desktopImage}>
                <Image
                  src={desktop}
                  alt={alt}
                  width={754}
                  height={480}
                  sizes="(min-width: 1024px) 754px, 100vw"
                  className={styles.image}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;
