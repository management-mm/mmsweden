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
}

export default function ProductImageBase({
  photos,
  name,
  locale,
  priority = false,
}: Props) {
  const altText = name ? getProductName(name, locale) : '';

  const firstPhoto = photos?.find(
    photo => typeof photo === 'string' && photo.trim()
  );

  if (!firstPhoto) {
    return <ProductImagePlaceholder variant="card" />;
  }

  return (
    <div className="relative h-[218px] w-full rounded-t-[4px]">
      <Image
        src={optimizeCloudinaryImage(firstPhoto, 360)}
        alt={altText}
        fill
        unoptimized
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? 'eager' : 'lazy'}
        className="rounded-t-[4px] object-cover select-none"
        sizes="(max-width: 768px) 100vw, 296px"
      />
    </div>
  );
}
