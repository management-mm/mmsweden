import type { Metadata } from 'next';

import FormForSale from '@components/sellToUs/FormForSale';
import Instructions from '@components/sellToUs/Instructions';

import { createPageMetadata } from '@i18n/seo';
import type { AppLocale } from '@i18n/config';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/sell-to-us',
    title: 'Sell to Us | Meat Machines',
  });
}

const SellToUs = () => {
  return (
    <>
      <Instructions />
      <FormForSale />
    </>
  );
};

export default SellToUs;