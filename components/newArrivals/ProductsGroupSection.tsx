import type { IProduct } from '@interfaces/IProduct';

import ProductCard from '@components/common/productCard/ProductCard';

import { AppLocale } from '@i18n/config';

type Props = {
  date: string;
  items: IProduct[];
  locale: AppLocale;
  dateAddedLabel: string;
};

const formatGroupedDate = (date: string, locale: AppLocale) => {
  const [year, month, day] = date.split('-').map(Number);

  const safeDate = new Date(year, month - 1, day, 12);

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  }).format(safeDate);
};

export default function ProductsGroupSection({
  date,
  items,
  locale,
  dateAddedLabel,
}: Props) {
  const formattedDate = formatGroupedDate(date, locale);

  return (
    <section className="border-line mb-10 border-t pt-6 md:mb-12 md:pt-8">
      <div className="mb-5 flex flex-col items-center gap-2 md:mb-6 md:flex-row md:justify-center">
        <p className="text-title text-center text-[18px] font-semibold md:text-[24px]">
          <span>{dateAddedLabel}</span>
          <span className="hidden md:inline">&nbsp;—&nbsp;</span>
        </p>

        <p className="text-primary text-center text-[16px] md:text-[20px]">
          {formattedDate}
        </p>
      </div>

      <ul className="flex flex-wrap justify-center gap-4 md:justify-start md:gap-6">
        {items.map(product => (
          <li
            key={product._id}
            className="w-[296px] transition-transform duration-300 hover:-translate-y-1 md:w-[264px]"
          >
            <ProductCard product={product} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
