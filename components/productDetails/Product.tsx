import { IProduct } from '@interfaces/IProduct';

import Details from './Details';
import Slider from './Slider';
import Video from './Video';

import Breadcrumb from '@components/common/Breadcrumb';

import { cn } from '@utils/cn';
import { getBreadcrumbCategories } from '@utils/getBreadcrumbCategoryData';
import getProductName from '@utils/getProductName';

import type { AppLocale } from '@i18n/config';

type Props = {
  product: IProduct;
  locale: AppLocale;
  slug: string;
  categorySlug?: string;
  subcategorySlug?: string;
};

const Product = async ({
  product,
  locale,
  categorySlug,
  subcategorySlug,
}: Props) => {
  const { name, photos, video } = product;

  const productName = name ? getProductName(name, locale) : '';

  const { category, subcategory } = await getBreadcrumbCategories(
    locale,
    categorySlug,
    subcategorySlug
  );

  return (
    <div className={cn('container w-full min-w-0', 'pt-[12px] md:pt-[22px]')}>
      <Breadcrumb
        category={category}
        subcategory={subcategory}
        product={productName ? { label: productName } : undefined}
      />

      <article className="w-full min-w-0 pb-[48px]">
        <h1 className="mb-[22px] max-w-full text-center text-[22px] font-bold break-words md:text-start">
          {productName}
        </h1>

        <div className="w-full min-w-0 gap-[30px] pb-[22px] md:flex md:items-start">
          <div className="mb-[22px] w-full max-w-full min-w-0 md:w-auto">
            {photos && photos.length > 1 ? (
              <Slider alt={productName} photos={photos} />
            ) : (
              photos?.[0] && (
                <img
                  className="block h-auto w-full max-w-full rounded-[4px] object-contain"
                  src={photos[0]}
                  alt={productName}
                />
              )
            )}

            {video && (
              <div className="hidden max-w-full min-w-0 md:block">
                <Video video={video} />
              </div>
            )}
          </div>

          <div className="max-w-full min-w-0">
            <Details isLoading={false} locale={locale} product={product} />
          </div>
        </div>

        {video && (
          <div className="w-full min-w-0 md:hidden">
            <Video video={video} />
          </div>
        )}
      </article>
    </div>
  );
};

export default Product;
