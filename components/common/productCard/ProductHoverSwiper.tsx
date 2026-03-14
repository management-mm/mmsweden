'use client';

import { type FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Image from 'next/image';
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
          <SwiperSlide key={`${photo}-${index}`} className="photo-slide">
            <div
              className="relative h-[218px] w-full overflow-hidden rounded-[4px]"
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={optimizeCloudinaryImage(photo, 320)}
                alt={alt}
                fill
                className="object-cover"
                sizes="320px"
                priority={index === 0}
                draggable={false}
              />
            </div>
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
