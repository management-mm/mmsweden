import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { IProduct } from '@interfaces/IProduct';

import { LanguageContext } from '@components/SharedLayout';
import ProductCard from '@components/common/productCard/ProductCard';

import { fetchProducts } from '@store/products/operations';
import { selectProducts } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { Title } from '@enums/i18nConstants';

const LatestArrivals = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const products: IProduct[] = useAppSelector(selectProducts);

  const [groupedProducts, setGroupedProducts] = useState<
    Record<string, IProduct[]>
  >({});

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'latest' }));
  }, [dispatch]);

  useEffect(() => {
    const grouped = products.reduce(
      (acc, product) => {
        const dateKey = product.createdAt.toString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(product);
        return acc;
      },
      {} as Record<string, IProduct[]>
    );

    setGroupedProducts(grouped);
  }, [products]);

  return (
    <section className="pb-[96px] pt-[22px]">
      <div className="container">
        {Object.entries(groupedProducts).map(([date, products]) => (
          <div key={date} className="mb-8">
            <p className="mb-4 text-center text-[18px] font-semibold text-title md:text-[24px]">
              <span>{t(Title.DateAdded)}</span>
              <br className="md:hidden" />
              <span className="hidden md:inline">&nbsp;-&nbsp;</span>
              {new Date(date).toLocaleString(language, { dateStyle: 'long' })}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              {products.map(product =>
                !product.deletionDate ? (
                  <ProductCard
                    key={product._id}
                    product={product}
                    className="w-[296px] md:w-[264px]"
                  />
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestArrivals;
