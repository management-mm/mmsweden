import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Loader from '@components/common/loaders/Loader';
import Instructions from '@components/sellToUs/Instructions';

import type { AppLocale } from '@i18n/config';
import { getPageSeo } from '@i18n/pageSeo';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const FormForSale = dynamic(() => import('@components/sellToUs/FormForSale'), {
  loading: () => <Loader />,
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPageSeo('sellToUs', locale);

  return createPageMetadata({
    locale,
    path: '/sell-to-us',
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
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
