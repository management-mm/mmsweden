import type { Metadata } from 'next';

import Instructions from '@components/sellToUs/Instructions';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';
import dynamic from 'next/dynamic';
import Loader from '@components/common/loaders/Loader';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const FormForSale = dynamic(() => import('@components/sellToUs/FormForSale'), 
{ loading: () => ( <Loader /> ), });

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
