'use client';

import { useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { IProduct } from '@interfaces/IProduct';
import { useTranslations } from 'next-intl';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';
import ProductCard from '@components/common/productCard/ProductCard';

import { fetchProducts } from '@store/products/operations';
import {
  selectProductsCacheByKey,
  selectProductsLastFetchedAtByKey,
  selectProductsStatusByKey,
} from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

import { CACHE_KEY, TTL } from '@constants/cacheProducts';

const PER_PAGE = 10;
const MAX_RENDER = 10;

const LatestArrivals = () => {
  const t = useTranslations();
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();
  const dispatch = useAppDispatch();

  const cachedProducts = useAppSelector(selectProductsCacheByKey(CACHE_KEY));
  const lastFetchedAt = useAppSelector(
    selectProductsLastFetchedAtByKey(CACHE_KEY)
  );
  const status = useAppSelector(selectProductsStatusByKey(CACHE_KEY));
  const language = useCurrentLocale();

  const products: IProduct[] = useMemo(() => {
    return (cachedProducts ?? [])
      .filter(product => !product.deletionDate)
      .slice(0, MAX_RENDER);
  }, [cachedProducts]);

  useEffect(() => {
    if (status === 'loading') return;

    const cachedCount = cachedProducts?.length ?? 0;
    const isFresh = lastFetchedAt !== null && Date.now() - lastFetchedAt < TTL;

    if (cachedCount >= PER_PAGE && isFresh) return;

    dispatch(
      fetchProducts({
        sort: 'latest',
        perPage: PER_PAGE,
        page: 1,
        cacheKey: CACHE_KEY,
        mode: 'replace',
      })
    );
  }, [dispatch, status, lastFetchedAt, cachedProducts]);

  return (
    <section className="text-primary pt-[48px] pb-[96px]">
      <div className="container">
        <div className="relative mb-[22px] flex items-end justify-between">
          <h2 className="shrink-0 text-[18px] font-semibold md:text-[24px] md:leading-[0.8]">
            {t(Title.LatestArrivals)}
          </h2>

          <DecorativeLine intent="latestArrivals" />

          <div className="flex gap-[12px]">
            <button
              type="button"
              className="border-line flex h-[44px] w-[44px] items-center justify-center rounded-full border"
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowLeft}
                size={{ width: 13, height: 18 }}
              />
            </button>

            <button
              type="button"
              className="border-line flex h-[44px] w-[44px] items-center justify-center rounded-full border"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowRight}
                size={{ width: 13, height: 18 }}
              />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={onSwiperInit}
          style={{ width: 'calc(49% + 50vw)' }}
          slidesPerView="auto"
          spaceBetween={10}
          className="slider"
          breakpoints={{
            768: {
              spaceBetween: 30,
            },
          }}
        >
          {products.map(product => (
            <SwiperSlide key={product._id}>
              <ProductCard
                language={language}
                product={product}
                className="w-[296px] md:w-[264px] lg:w-[264px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LatestArrivals;
