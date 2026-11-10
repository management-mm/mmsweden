'use client';

import { useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import Image from 'next/image';

import ProductImagePlaceholder from '@components/common/ProductImagePlaceholder';

import { optimizeCloudinaryImage } from '@utils/cloudinary';
import getProductName from '@utils/getProductName';

import { AppLocale } from '@i18n/config';

interface Props {
  photos: string[];
  name: MultiLanguageString | string;
  locale: AppLocale;
  priority?: boolean;
  onImageReadyChange?: (isReady: boolean) => void;
}

type ImageStatus = 'optimized' | 'original' | 'failed';

interface ImageState {
  photo: string;
  status: ImageStatus;
  loadedSrc: string | null;
}

export default function ProductImageBase({
  photos,
  name,
  locale,
  priority = false,
  onImageReadyChange,
}: Props) {
  const [imageState, setImageState] = useState<ImageState | null>(null);

  const altText = name ? getProductName(name, locale) : '';

  const firstPhoto = photos
    ?.find(photo => typeof photo === 'string' && photo.trim().length > 0)
    ?.trim();

  const optimizedPhoto = firstPhoto
    ? optimizeCloudinaryImage(firstPhoto, 360)
    : '';

  // Ignore image state from a previously displayed product.
  const currentState =
    imageState && imageState.photo === firstPhoto ? imageState : null;

  const status: ImageStatus = currentState?.status ?? 'optimized';

  const imageSrc =
    status === 'original' ? firstPhoto : optimizedPhoto || firstPhoto;

  const isImageReady =
    Boolean(firstPhoto) &&
    status !== 'failed' &&
    currentState?.loadedSrc === imageSrc;

  // Notify parent whether hover slider can be opened.
  useEffect(() => {
    onImageReadyChange?.(isImageReady);
  }, [isImageReady, onImageReadyChange]);

  const handleImageError = () => {
    if (!firstPhoto) return;

    // Try the original URL if optimization failed.
    if (
      status === 'optimized' &&
      optimizedPhoto &&
      optimizedPhoto !== firstPhoto
    ) {
      setImageState({
        photo: firstPhoto,
        status: 'original',
        loadedSrc: null,
      });

      return;
    }

    // Both image versions failed.
    setImageState({
      photo: firstPhoto,
      status: 'failed',
      loadedSrc: null,
    });
  };

  const handleImageLoad = () => {
    if (!firstPhoto || !imageSrc) return;

    setImageState({
      photo: firstPhoto,
      status,
      loadedSrc: imageSrc,
    });
  };

  // No image or image failed to load.
  if (!firstPhoto || status === 'failed' || !imageSrc) {
    return <ProductImagePlaceholder variant="card" />;
  }

  return (
    <div className="relative h-[218px] w-full overflow-hidden rounded-t-[4px]">
      <Image
        key={imageSrc}
        src={imageSrc}
        alt={altText}
        fill
        unoptimized
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? undefined : 'lazy'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className="rounded-t-[4px] object-cover select-none"
        sizes="(max-width: 768px) 100vw, 296px"
      />
    </div>
  );
}
