'use client';

import { Swiper, SwiperSlide } from 'swiper/react';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';
import 'swiper/css';

import DecorativeLine from '@components/common/DecorativeLine';
import NaviArrowSlider from '@components/common/NaviArrowSlider';
import ProductCard from '@components/common/productCard/ProductCard';

import useSwiperNavigation from '@hooks/useSwiperNavigation';

import type { AppLocale } from '@i18n/config';

type Props = {
  products: IProduct[];
  locale: AppLocale;
  title: string;
  categorySlug: string;
  subcategorySlug: string;
};

const RecommendedProductsCarousel = ({
  products,
  locale,
  title,
  categorySlug,
  subcategorySlug,
}: Props) => {
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();

  return (
    <section aria-labelledby="recommended-products-heading">
      <div className="container">
        <div className="relative mb-[22px] flex flex-wrap items-end justify-between gap-[12px] md:flex-nowrap">
          <h2
            id="recommended-products-heading"
            className="shrink-0 text-[18px] font-semibold md:text-[24px] md:leading-[0.8]"
          >
            {title}
          </h2>

          <DecorativeLine className={clsx()} intent="latestArrivals" />

          <div className="hidden gap-[12px] md:flex">
            <NaviArrowSlider onClick={handlePrev} iconId="ArrowLeft" />
            <NaviArrowSlider onClick={handleNext} iconId="ArrowRight" />
          </div>
        </div>

        <Swiper
          onSwiper={onSwiperInit}
          style={{ width: 'calc(49% + 50vw)' }}
          slidesPerView="auto"
          spaceBetween={10}
          className="slider"
          breakpoints={{
            768: { spaceBetween: 30 },
          }}
        >
          {products.map(product => (
            <SwiperSlide key={product._id}>
              <ProductCard
                locale={locale}
                product={product}
                className="w-[296px] md:w-[264px]"
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecommendedProductsCarousel;
