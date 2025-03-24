import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';

import Details from './Details';
import Slider from './Slider';

import { LanguageContext } from '@components/SharedLayout';
import Breadcrumb from '@components/common/Breadcrumb';
import DecorativeLine from '@components/common/DecorativeLine';
import VideoPlayer from '@components/common/VideoPlayer';

import { fetchProductById } from '@store/products/operations';
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
  const { productId } = useParams();
  const { name, photos, video } = product || {};

  useEffect(() => {
    dispatch(clearProduct());
    dispatch(fetchProductById({ productId }));
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
                  video={video ? video : ''}
                />
              ) : (
                photos &&
                photos[0] && (
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
                  <h4 className="mb-[22px] text-[18px] font-semibold text-primary">
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
              <h4 className="mb-[22px] text-[18px] font-semibold text-primary">
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
