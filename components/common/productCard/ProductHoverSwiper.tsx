'use client';

import { type FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import NaviArrowSlider from '../NaviArrowSlider';

import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { optimizeCloudinaryImage } from '@utils/cloudinary';

interface Props {
  photos: string[];
  alt: string;
  setCurrentIndex: (index: number) => void;
}

const ProductHoverSwiper: FC<Props> = ({ photos, alt, setCurrentIndex }) => {
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();

  return (
    <div className="absolute inset-0 z-10">
      <Swiper
        onSwiper={onSwiperInit}
        slidesPerView={1}
        spaceBetween={0}
        className="h-[218px]"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={photo}>
            <img
              src={optimizeCloudinaryImage(photo, 600)}
              alt={alt}
              className="h-[218px] w-full rounded-[4px] object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
              onClick={() => setCurrentIndex(index)}
            />
          </SwiperSlide>
        ))}

        {photos.length > 1 && (
          <>
            <NaviArrowSlider
              intent="details"
              className="left-[8px]"
              iconClassName="fill-secondary"
              onClick={handlePrev}
              iconId="ArrowLeft"
            />

            <NaviArrowSlider
              intent="details"
              iconClassName="fill-secondary"
              className="right-[8px]"
              onClick={handleNext}
              iconId="ArrowRight"
            />
          </>
        )}
      </Swiper>
    </div>
  );
};

export default ProductHoverSwiper;
