import type { Metadata } from 'next';

import LatestArrivals from '@components/newArrivals/LatestArrivals';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/new-arrivals',
    title: 'New Arrivals | Meat Machines',
    description:
      'Browse the latest arrivals of used food processing and packaging equipment at Meat Machines.',
  });
}

const NewArrivals = () => {
  return (
    <>
      <LatestArrivals />
    </>
  );
};

export default NewArrivals;
