'use client';

import { type FC, useEffect, useState } from 'react';
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
import ProductImagePlaceholder from '@components/common/ProductImagePlaceholder';

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
  fallbackText?: string;
}

interface ImageWithFallbackProps {
  photo: string;
  alt: string;
  width: number;
  isMain?: boolean;
  priority?: boolean;
  fallbackText: string;
  onClick?: () => void;
}

interface ImageFallbackProps {
  alt: string;
  isMain?: boolean;
  fallbackText: string;
}

type ImageStatus = 'optimized' | 'original' | 'failed';

// Reuse the existing placeholder.
const ImageFallback: FC<ImageFallbackProps> = ({
  alt,
  isMain = false,
  fallbackText,
}) => {
  return (
    <div
      role="img"
      aria-label={`${alt}: ${fallbackText}`}
      className={`w-full overflow-hidden rounded-[4px] [&>*]:!h-full [&>*]:!w-full ${isMain ? 'aspect-[4/3]' : 'aspect-square'} `}
    >
      <ProductImagePlaceholder variant="card" />
    </div>
  );
};

// Image with Cloudinary fallback.
const ImageWithFallback: FC<ImageWithFallbackProps> = ({
  photo,
  alt,
  width,
  isMain = false,
  priority = false,
  fallbackText,
  onClick,
}) => {
  const [status, setStatus] = useState<ImageStatus>('optimized');

  const [isLoaded, setIsLoaded] = useState(false);

  const optimizedSrc = optimizeCloudinaryImage(photo, width);

  const imageSrc = status === 'original' ? photo : optimizedSrc;

  const handleImageError = () => {
    setIsLoaded(false);

    // Try the original photo.
    if (status === 'optimized' && optimizedSrc !== photo) {
      setStatus('original');
      return;
    }

    // Both versions failed.
    setStatus('failed');
  };

  if (status === 'failed') {
    return (
      <ImageFallback alt={alt} isMain={isMain} fallbackText={fallbackText} />
    );
  }

  return (
    <img
      key={imageSrc}
      src={imageSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onLoad={() => setIsLoaded(true)}
      onError={handleImageError}
      onClick={isMain && isLoaded ? onClick : undefined}
      className={`screen-none block h-auto w-full max-w-full rounded-[4px] object-contain ${isLoaded ? 'opacity-100' : 'opacity-0'} ${isMain && isLoaded && onClick ? 'cursor-pointer' : ''} `}
    />
  );
};

const Slider: FC<ISliderProps> = ({
  photos,
  alt,
  fallbackText = 'Image unavailable',
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();

  const isLoading = useAppSelector(selectIsLoading);

  const validPhotos = (photos ?? [])
    .filter(
      (photo): photo is string =>
        typeof photo === 'string' && photo.trim().length > 0
    )
    .map(photo => photo.trim());

  const photosKey = JSON.stringify(validPhotos);

  const hasPhotos = validPhotos.length > 0;
  const hasMultiplePhotos = validPhotos.length > 1;

  // Close LightBox when photos change.
  useEffect(() => {
    setCurrentIndex(-1);
  }, [photosKey]);

  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
      <div className="w-full max-w-full min-w-0 lg:w-[754px]">
        <div className="mb-[32px] w-full min-w-0 overflow-hidden">
          {isLoading && !hasPhotos ? (
            <>
              {/* SKELETON */}
              <Skeleton
                className="mb-[10px] !block w-full rounded-[4px]"
                height={400}
              />

              <div className="grid grid-cols-4 gap-[10px]">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="!block w-full rounded-[2px]"
                    height={70}
                  />
                ))}
              </div>
            </>
          ) : !hasPhotos ? (
            // NO PHOTOS
            <ImageFallback alt={alt} isMain fallbackText={fallbackText} />
          ) : (
            <>
              {/* MAIN SLIDER */}
              <Swiper
                key={`main-${photosKey}`}
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
                {validPhotos.map((photo, index) => (
                  <SwiperSlide
                    key={`${photo}-${index}`}
                    className="rounded-[4px]"
                  >
                    <ImageWithFallback
                      key={`${photo}-main`}
                      photo={photo}
                      alt={alt}
                      width={1200}
                      isMain
                      priority={index === 0}
                      fallbackText={fallbackText}
                      onClick={() => setCurrentIndex(index)}
                    />
                  </SwiperSlide>
                ))}

                {/* NAVIGATION */}
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
              {hasMultiplePhotos && (
                <Swiper
                  key={`thumbs-${photosKey}`}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode
                  watchSlidesProgress
                  slideToClickedSlide
                  modules={[FreeMode, Thumbs]}
                  className={`mySwiper ${styles.thumbsSwiper}`}
                >
                  {validPhotos.map((photo, index) => (
                    <SwiperSlide
                      key={`${photo}-thumb-${index}`}
                      className="min-w-0 overflow-hidden rounded-[2px]"
                    >
                      <ImageWithFallback
                        key={`${photo}-thumb-image`}
                        photo={photo}
                        alt={`${alt} - ${index + 1}`}
                        width={200}
                        fallbackText={fallbackText}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </>
          )}
        </div>

        {/* LIGHTBOX */}
        {!isLoading &&
          hasPhotos &&
          currentIndex >= 0 &&
          currentIndex < validPhotos.length && (
            <LightBox
              photos={validPhotos}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          )}
      </div>
    </SkeletonTheme>
  );
};

export default Slider;
