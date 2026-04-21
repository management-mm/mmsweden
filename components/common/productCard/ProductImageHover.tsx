'use client';

import { useState } from 'react';

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

  if (!photos.length) {
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
        className="relative h-[218px] w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={isHovered ? 'opacity-0' : 'opacity-100'}>
          <ProductImageBase
            photos={photos}
            name={name}
            locale={locale}
            priority={priority}
          />
        </div>

        {isHovered && (
          <HoverSwiper
            photos={photos}
            alt={altText}
            onImageClick={setCurrentIndex}
          />
        )}
      </div>

      {currentIndex !== -1 && (
        <LightBox
          photos={photos}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </>
  );
}
