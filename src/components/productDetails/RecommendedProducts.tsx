import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import { fetchRecommendedProductsById } from '@api/productService';
import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';
import { nanoid } from 'nanoid';

import DecorativeLine from '@components/common/DecorativeLine';
import NaviArrowSlider from '@components/common/NaviArrowSlider';
import ProductCard from '@components/common/productCard/ProductCard';

import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { Title } from '@enums/i18nConstants';

const RecommendedProducts = () => {
  const { t } = useTranslation();
  const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>(
    []
  );
  const { productId } = useParams();
  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();

  useEffect(() => {
    async function fetchingRecommendedProducts() {
      try {
        const fetchedRecommendedProducts =
          await fetchRecommendedProductsById(productId);
        setRecommendedProducts(fetchedRecommendedProducts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchingRecommendedProducts();
  }, [productId]);
  console.log(recommendedProducts.length);
  return (
    <section>
      <div className="container">
        <div className="relative mb-[22px] flex flex-wrap items-end justify-between gap-[12px] md:flex-nowrap">
          <h2 className="shrink-0 text-[18px] font-semibold md:text-[24px] md:leading-[0.8]">
            {t(Title.YouMayAlsoBeInterestedIn)}
          </h2>
          <DecorativeLine className={clsx()} intent="latestArrivals" />
          <div className="hidden gap-[12px] md:flex">
            <NaviArrowSlider onClick={handlePrev} iconId={'ArrowLeft'} />
            <NaviArrowSlider onClick={handleNext} iconId={'ArrowRight'} />
          </div>
        </div>

        <Swiper
          onSwiper={onSwiperInit}
          style={{ width: 'calc(49% + 50vw)' }}
          slidesPerView={'auto'}
          spaceBetween={'10px'}
          className="slider"
          breakpoints={{
            768: {
              spaceBetween: 30,
            },
          }}
        >
          {recommendedProducts.map(product => {
            return (
              <SwiperSlide key={nanoid()}>
                <ProductCard
                  product={product}
                  className="w-[296px] md:w-[264px]"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default RecommendedProducts;
