import type { IProduct } from '@interfaces/IProduct';

import ProductCard from '@components/common/productCard/ProductCard';

import { AppLocale } from '@i18n/config';

type Props = {
  date: string;
  items: IProduct[];
  locale: AppLocale;
  dateAddedLabel: string;
};

export default function ProductsGroupSection({
  date,
  items,
  locale,
  dateAddedLabel,
}: Props) {
  return (
    <div className="mb-8">
      <p className="text-title mb-4 text-center text-[18px] font-semibold md:text-[24px]">
        <span>{dateAddedLabel}</span>
        <br className="md:hidden" />
        <span className="hidden md:inline">&nbsp;-&nbsp;</span>
        {new Date(date).toLocaleDateString(locale, { dateStyle: 'long' })}
      </p>

      <ul className="flex flex-wrap justify-center gap-4 md:justify-start">
        {items.map(product => (
          <li key={product._id} className="w-[296px] md:w-[264px]">
            <ProductCard product={product} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
