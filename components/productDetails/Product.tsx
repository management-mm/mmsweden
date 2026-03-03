'use client';

import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { LanguageContext } from 'app/providers';
import { useParams } from 'next/navigation';

import Details from './Details';
import Slider from './Slider';

import Breadcrumb from '@components/common/Breadcrumb';
import DecorativeLine from '@components/common/DecorativeLine';
import VideoPlayer from '@components/common/VideoPlayer';

import { fetchProductBySlug } from '@store/products/operations';
import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading, selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';
import getProductName from '@utils/getProductName';

import { Title } from '@enums/i18nConstants';

const Product = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('LanguageContext must be used within a LanguageProvider');
  }

  const { language } = context;
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductDetails);
  const isLoading = useAppSelector(selectIsLoading);

  const windowWidth = useWindowWidth();

  const params = useParams<{ slug: string }>();
const slug = params?.slug;
const productId = slug?.split('-').pop();

  const { name, photos, video } = product || {};

  useEffect(() => {
    if (!productId) return;
    if (!slug) return;

  dispatch(clearProduct());
  dispatch(fetchProductBySlug({ slug }));
  }, [dispatch, productId]);

  return (
    <div className={cn('container', 'pt-[12px] md:pt-[22px]')}>
      <Breadcrumb
        productId={productId}
        name={name && getProductName(name, language)}
      />

      <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
        <article className="pb-[48px]">
          <h2 className="mb-[22px] text-center text-[22px] font-bold md:text-start">
            {!isLoading && name ? (
              getProductName(name, language)
            ) : (
              <Skeleton width={150} />
            )}
          </h2>

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
                    width={'100%'}
                  />
                )
              )}

              {video && windowWidth >= 768 && (
                <>
                  <DecorativeLine intent="video" />
                  <h4 className="text-primary mb-[22px] text-[18px] font-semibold">
                    {t(Title.VideoOverview)}
                  </h4>
                  <VideoPlayer video={video} />
                </>
              )}
            </div>

            {product && <Details product={product} />}
          </div>

          {video && windowWidth < 768 && (
            <>
              <DecorativeLine intent="video" />
              <h4 className="text-primary mb-[22px] text-[18px] font-semibold">
                {t(Title.VideoOverview)}
              </h4>
              <VideoPlayer video={video} />
            </>
          )}
        </article>
      </SkeletonTheme>
    </div>
  );
};

export default Product;
