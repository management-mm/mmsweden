'use client';

import { IProduct } from '@interfaces/IProduct';
import { useTranslations } from 'next-intl';

import Details from './Details';
import Slider from './Slider';

import Breadcrumb from '@components/common/Breadcrumb';
import DecorativeLine from '@components/common/DecorativeLine';
import VideoPlayer from '@components/common/VideoPlayer';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';
import getProductName from '@utils/getProductName';

import { Title } from '@enums/i18nConstants';

import type { AppLocale } from '@i18n/config';

type Props = {
  product: IProduct;
  locale: AppLocale;
  slug: string;
};

const Product = ({ product, slug }: Props) => {
  const t = useTranslations();
  const language = useCurrentLocale();
  const windowWidth = useWindowWidth();

  const { name, photos, video } = product;

  return (
    <div className={cn('container', 'pt-[12px] md:pt-[22px]')}>
      <Breadcrumb
        slug={slug}
        name={name ? getProductName(name, language) : ''}
      />

      <article className="pb-[48px]">
        <h1 className="mb-[22px] text-center text-[22px] font-bold md:text-start">
          {name ? getProductName(name, language) : ''}
        </h1>

        <div className="gap-[30px] pb-[22px] md:flex md:items-start">
          <div className="mb-[22px]">
            {photos && photos.length > 1 ? (
              <Slider
                alt={name ? getProductName(name, language) : ''}
                photos={photos}
              />
            ) : (
              photos?.[0] && (
                <img
                  className="rounded-[4px]"
                  src={photos[0]}
                  alt={name ? getProductName(name, language) : ''}
                  width="100%"
                />
              )
            )}

            {video && windowWidth >= 768 && (
              <>
                <DecorativeLine intent="video" />
                <h2 className="text-primary mb-[22px] text-[18px] font-semibold">
                  {t(Title.VideoOverview)}
                </h2>
                <VideoPlayer video={video} />
              </>
            )}
          </div>

          <Details isLoading={false} language={language} product={product} />
        </div>

        {video && windowWidth < 768 && (
          <>
            <DecorativeLine intent="video" />
            <h2 className="text-primary mb-[22px] text-[18px] font-semibold">
              {t(Title.VideoOverview)}
            </h2>
            <VideoPlayer video={video} />
          </>
        )}
      </article>
    </div>
  );
};

export default Product;
