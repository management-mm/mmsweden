'use client';

import { type FC, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Swiper, SwiperSlide } from 'swiper/react';

import dynamic from 'next/dynamic';
import type SwiperType from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Keyboard, Thumbs } from 'swiper/modules';

import styles from './Slider.module.css';

import NaviArrowSlider from '@components/common/NaviArrowSlider';

import { selectIsLoading } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { optimizeCloudinaryImage } from '@utils/cloudinary';

const LightBox = dynamic(() => import('@components/common/LightBox'), {
  ssr: false,
});

interface ISliderProps {
  photos: string[];
  alt: string;
}

const Slider: FC<ISliderProps> = ({ photos, alt }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();

  const isLoading = useAppSelector(selectIsLoading);

  const hasMultiplePhotos = photos.length > 1;

  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
      <div className="w-full max-w-full min-w-0 lg:w-[754px]">
        <div className="mb-[32px] w-full min-w-0 overflow-hidden">
          {isLoading && photos.length === 0 ? (
            <>
              <Skeleton
                className="mb-[10px] !block w-full rounded-[4px]"
                height={400}
              />

              <div className="grid grid-cols-4 gap-[10px]">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="!block w-full rounded-[2px]"
                    height={70}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* MAIN SLIDER */}
              <Swiper
                keyboard={{
                  enabled: true,
                  onlyInViewport: false,
                }}
                onSwiper={onSwiperInit}
                slidesPerView={1}
                spaceBetween={0}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[FreeMode, Thumbs, Keyboard]}
                className={`mySwiper2 ${styles.mainSwiper}`}
              >
                {photos.map((photo, index) => (
                  <SwiperSlide
                    key={`${photo}-${index}`}
                    className="rounded-[4px]"
                  >
                    <img
                      src={optimizeCloudinaryImage(photo, 1200)}
                      alt={alt}
                      className="screen-none block h-auto w-full max-w-full rounded-[4px] object-contain"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                      onClick={() => setCurrentIndex(index)}
                    />
                  </SwiperSlide>
                ))}

                {hasMultiplePhotos && (
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
                      className="right-[8px]"
                      iconClassName="fill-secondary"
                      onClick={handleNext}
                      iconId="ArrowRight"
                    />
                  </>
                )}
              </Swiper>

              {/* THUMBNAILS */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                slideToClickedSlide
                modules={[FreeMode, Thumbs]}
                className={`mySwiper ${styles.thumbsSwiper}`}
              >
                {photos.map((photo, index) => (
                  <SwiperSlide
                    key={`${photo}-thumb-${index}`}
                    className="min-w-0 overflow-hidden rounded-[2px]"
                  >
                    <img
                      src={optimizeCloudinaryImage(photo, 200)}
                      alt={`${alt} - ${index + 1}`}
                      className="screen-none block h-auto w-full max-w-full rounded-[2px] object-contain"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>

        {/* LIGHTBOX */}
        {!isLoading && currentIndex !== -1 && (
          <LightBox
            photos={photos}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
      </div>
    </SkeletonTheme>
  );
};

export default Slider;
