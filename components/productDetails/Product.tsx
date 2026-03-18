import { IProduct } from '@interfaces/IProduct';

import Details from './Details';
import Slider from './Slider';
import Video from './Video';

import Breadcrumb from '@components/common/Breadcrumb';

import { cn } from '@utils/cn';
import getProductName from '@utils/getProductName';

import type { AppLocale } from '@i18n/config';

type Props = {
  product: IProduct;
  locale: AppLocale;
  slug: string;
};

const Product = ({ product, locale, slug }: Props) => {
  const { name, photos, video } = product;

  return (
    <div className={cn('container', 'pt-[12px] md:pt-[22px]')}>
      <Breadcrumb slug={slug} name={name ? getProductName(name, locale) : ''} />

      <article className="pb-[48px]">
        <h1 className="mb-[22px] text-center text-[22px] font-bold md:text-start">
          {name ? getProductName(name, locale) : ''}
        </h1>

        <div className="gap-[30px] pb-[22px] md:flex md:items-start">
          <div className="mb-[22px]">
            {photos && photos.length > 1 ? (
              <Slider
                alt={name ? getProductName(name, locale) : ''}
                photos={photos}
              />
            ) : (
              photos?.[0] && (
                <img
                  className="rounded-[4px]"
                  src={photos[0]}
                  alt={name ? getProductName(name, locale) : ''}
                  width="100%"
                />
              )
            )}

            {video && (
              <div className="hidden md:block">
                <Video video={video} />
              </div>
            )}
          </div>

          <Details isLoading={false} language={locale} product={product} />
        </div>

        {video && (
          <div className="md:hidden">
            <Video video={video} />
          </div>
        )}
      </article>
    </div>
  );
};

export default Product;
