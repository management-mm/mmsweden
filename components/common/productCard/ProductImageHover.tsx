'use client';

import { useCallback, useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import dynamic from 'next/dynamic';

import ProductImageBase from './ProductImageBase';

import { optimizeCloudinaryImage } from '@utils/cloudinary';
import getProductName from '@utils/getProductName';

import { AppLocale } from '@i18n/config';

const HoverSwiper = dynamic(() => import('./ProductHoverSwiper'), {
  ssr: false,
});

const LightBox = dynamic(() => import('@components/common/LightBox'), {
  ssr: false,
});

interface Props {
  photos: string[];
  name: MultiLanguageString | string;
  locale: AppLocale;
  priority?: boolean;
}

type ValidationStatus = 'checking' | 'valid' | 'invalid';

interface ValidationState {
  key: string;
  status: ValidationStatus;
}

// Check whether an image actually loads.
const loadImage = (src: string): Promise<boolean> =>
  new Promise(resolve => {
    const image = new window.Image();

    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);

    image.src = src;
  });

// Try optimized image first, then original.
const checkPhoto = async (photo: string): Promise<boolean> => {
  const optimized = optimizeCloudinaryImage(photo, 360);

  if (await loadImage(optimized)) {
    return true;
  }

  if (optimized !== photo) {
    return loadImage(photo);
  }

  return false;
};

export default function ProductImageHover({
  photos,
  name,
  locale,
  priority = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [readyPhoto, setReadyPhoto] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const altText = name ? getProductName(name, locale) : '';

  const validPhotos = (photos ?? [])
    .filter(
      (photo): photo is string =>
        typeof photo === 'string' && photo.trim().length > 0
    )
    .map(photo => photo.trim());

  const photosKey = JSON.stringify(validPhotos);
  const firstPhoto = validPhotos[0];

  const hasMultiplePhotos = validPhotos.length > 1;
  const isLightboxOpen = currentIndex !== -1;

  const isImageReady = Boolean(firstPhoto) && readyPhoto === firstPhoto;

  const validationStatus =
    validation?.key === photosKey ? validation.status : 'idle';

  const canShowHover =
    isImageReady && validationStatus === 'valid' && !isLightboxOpen;

  const showHover = isHovered && canShowHover;

  const handleImageReadyChange = useCallback(
    (isReady: boolean) => {
      setReadyPhoto(isReady ? (firstPhoto ?? null) : null);

      if (!isReady) {
        setIsHovered(false);
      }
    },
    [firstPhoto]
  );

  const handleMouseEnter = () => {
    if (!isImageReady || isLightboxOpen || validationStatus === 'invalid') {
      return;
    }

    setIsHovered(true);

    // Images already checked.
    if (validationStatus !== 'idle') {
      return;
    }

    // Verify all images before enabling the slider.
    setValidation({
      key: photosKey,
      status: 'checking',
    });

    void Promise.all(validPhotos.map(checkPhoto)).then(results => {
      const allImagesWork = results.every(Boolean);

      setValidation(previous => {
        // Ignore stale checks after product changes.
        if (previous?.key !== photosKey || previous.status !== 'checking') {
          return previous;
        }

        return {
          key: photosKey,
          status: allImagesWork ? 'valid' : 'invalid',
        };
      });
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Catch errors from images inside HoverSwiper too.
  const handleHoverImageError = () => {
    setValidation({
      key: photosKey,
      status: 'invalid',
    });

    setIsHovered(false);
  };

  useEffect(() => {
    if (isLightboxOpen) {
      setIsHovered(false);
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    setCurrentIndex(-1);
    setIsHovered(false);
  }, [photosKey]);

  // No slider for zero or one photo.
  if (!hasMultiplePhotos) {
    return (
      <ProductImageBase
        photos={validPhotos}
        name={name}
        locale={locale}
        priority={priority}
      />
    );
  }

  return (
    <>
      <div
        className="relative h-[218px] w-full overflow-hidden rounded-t-[8px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {/* BASE IMAGE */}
        <div
          className={[
            'absolute inset-0 transition-opacity duration-300',
            showHover ? 'pointer-events-none opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          <ProductImageBase
            key={firstPhoto}
            photos={validPhotos}
            name={name}
            locale={locale}
            priority={priority}
            onImageReadyChange={handleImageReadyChange}
          />
        </div>

        {/* HOVER SLIDER */}
        {canShowHover && (
          <div
            className={[
              'absolute inset-0 transition-opacity duration-300',
              showHover ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
            onErrorCapture={handleHoverImageError}
          >
            <HoverSwiper
              photos={validPhotos}
              alt={altText}
              onImageClick={setCurrentIndex}
            />
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {isLightboxOpen && (
        <LightBox
          photos={validPhotos}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </>
  );
}
