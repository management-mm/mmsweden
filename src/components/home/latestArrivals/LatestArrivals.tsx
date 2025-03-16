import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';

import { type IProduct } from '@interfaces/IProduct';
import 'swiper/css';

import DecorativeLine from '@components/common/DecorativeLine';
import SvgIcon from '@components/common/SvgIcon';
import ProductCard from '@components/common/productCard/ProductCard';

import { fetchProducts } from '@store/products/operations';
import { selectProducts } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import useSwiperNavigation from '@hooks/useSwiperNavigation';

import { Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const LatestArrivals = () => {
  const { t } = useTranslation();

  const { handlePrev, handleNext, onSwiperInit } = useSwiperNavigation();
  const dispatch = useAppDispatch();

  const products: IProduct[] = useAppSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'latest' }));
  }, [dispatch]);

  return (
    <section className="pb-[96px] pt-[48px] text-primary">
      <div className="container">
        <div className="relative mb-[22px] flex items-end justify-between">
          <h2 className="shrink-0 text-[18px] font-semibold md:text-[24px] md:leading-[0.8]">
            {t(Title.LatestArrivals)}
          </h2>
          <DecorativeLine intent="latestArrivals" />
          <div className="flex gap-[12px]">
            <div
              className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full border border-line"
              onClick={handlePrev}
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowLeft}
                size={{ width: 13, height: 18 }}
              />
            </div>
            <div
              className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full border border-line"
              onClick={handleNext}
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.ArrowRight}
                size={{ width: 13, height: 18 }}
              />
            </div>
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
          {products.map(product => {
            if (product.deletionDate) return null;

            return (
              <SwiperSlide key={product._id}>
                <ProductCard
                  product={product}
                  className="w-[296px] md:w-[264px] lg:w-[264px]"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default LatestArrivals;
