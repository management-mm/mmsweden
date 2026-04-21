'use client';

import { useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import dynamic from 'next/dynamic';

import ProductImageBase from './ProductImageBase';

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

export default function ProductImageHover({
  photos,
  name,
  locale,
  priority = false,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const altText = name ? getProductName(name, locale) : '';
  const hasMultiplePhotos = photos.length > 1;
  const isLightboxOpen = currentIndex !== -1;

  useEffect(() => {
    if (isLightboxOpen) {
      setIsHovered(false);
    }
  }, [isLightboxOpen]);

  if (!photos.length || !hasMultiplePhotos) {
    return (
      <ProductImageBase
        photos={photos}
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <div
          className={[
            'absolute inset-0 transition-opacity duration-300',
            isHovered ? 'pointer-events-none opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          <ProductImageBase
            photos={photos}
            name={name}
            locale={locale}
            priority={priority}
          />
        </div>

        <div
          className={[
            'absolute inset-0 transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'pointer-events-none opacity-0',
          ].join(' ')}
        >
          <HoverSwiper
            photos={photos}
            alt={altText}
            onImageClick={setCurrentIndex}
          />
        </div>
      </div>

      {isLightboxOpen && (
        <LightBox
          photos={photos}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </>
  );
}
