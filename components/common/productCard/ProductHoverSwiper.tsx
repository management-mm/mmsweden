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
  onImageClick: (index: number) => void;
}

const ProductHoverSwiper: FC<Props> = ({ photos, alt, onImageClick }) => {
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
            <button
              type="button"
              className="relative block h-[218px] w-full overflow-hidden rounded-[4px]"
              onClick={() => onImageClick(index)}
            >
              <Image
                src={optimizeCloudinaryImage(photo, 360)}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 296px"
                unoptimized
                priority={index === 0}
                draggable={false}
              />
            </button>
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
