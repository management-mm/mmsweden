import type { Metadata } from 'next';

import AllProductsView from '@components/allProducts/AllProductsView';

import { createPageMetadata } from '@i18n/seo';
import type { AppLocale } from '@i18n/config';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/all-products',
    title: 'All Machines | Meat Machines',
    description: 'Browse our catalogue of used food processing machinery.',
  });
}

export default function AllProductsPage() {
  return <AllProductsView mode="public" />;
}