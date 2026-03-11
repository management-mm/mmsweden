'use client';

import { type FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { MultiLanguageString } from '@interfaces/IProduct';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { optimizeCloudinaryImage } from '@utils/cloudinary';
import getProductName from '@utils/getProductName';

import { AppLocale } from '@i18n/config';

const HoverSwiper = dynamic(() => import('./ProductHoverSwiper'), {
  ssr: false,
});

const LightBox = dynamic(() => import('@components/common/LightBox'), {
  ssr: false,
});

interface IProductImageProps {
  isLoading: boolean;
  photos: string[];
  name: MultiLanguageString | string;
  language: AppLocale;
}

const ProductImage: FC<IProductImageProps> = ({
  isLoading,
  photos,
  name,
  language,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const altText = name ? getProductName(name, language) : '';

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isLoading ? (
        photos.length !== 0 ? (
          <>
            {isHovered && (
              <HoverSwiper
                photos={photos}
                alt={altText}
                setCurrentIndex={setCurrentIndex}
              />
            )}

            <div
              className={`relative h-[218px] w-full rounded-t-[4px] transition-opacity duration-300 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Image
                src={optimizeCloudinaryImage(photos[0], 600)}
                alt={altText}
                fill
                className="rounded-t-[4px] object-cover select-none"
                sizes="(max-width:768px) 100vw, 296px"
              />
            </div>
          </>
        ) : (
          <div className="h-[200px] w-full rounded-t-[4px] bg-slate-500" />
        )
      ) : (
        <Skeleton height={200} duration={1.2} />
      )}

      {currentIndex !== -1 && (
        <LightBox
          photos={photos}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </div>
  );
};

export default ProductImage;
