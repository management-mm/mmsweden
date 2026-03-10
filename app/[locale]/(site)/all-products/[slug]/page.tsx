import type { Metadata } from 'next';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import { SUPPORTED_LOCALES, type AppLocale } from '@i18n/config';

type Props = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

type ProductResponse = {
  _id: string;
  idNumber: string;
  slug?: string;
  name: Record<AppLocale, string>;
  description: Record<AppLocale, string>;
  photos?: string[];
};

async function getProductForMetadata(
  slug: string
): Promise<ProductResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${baseUrl}/products/${slug}`, {
    cache: 'no-store'
  });

  if (!res.ok) return null;

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const product = await getProductForMetadata(slug);

  const languages = Object.fromEntries([
  ...SUPPORTED_LOCALES.map(l => [l, `${siteUrl}/${l}/all-products/${slug}`]),
  ['x-default', `${siteUrl}/en/all-products/${slug}`]
]);

  if (!product) {
    return {
      title: 'Product Details | Meat Machines',
      alternates: {
        canonical: `${siteUrl}/${locale}/all-products/${slug}`,
        languages
      }
    };
  }

  const localizedName = product.name?.[locale] || product.name?.en || 'Product';
  const localizedDescription =
    product.description?.[locale] ||
    product.description?.en ||
    'Used food processing and packaging equipment.';

  const shortDescription =
    localizedDescription.length > 160
      ? `${localizedDescription.slice(0, 157)}...`
      : localizedDescription;

  return {
    title: `${localizedName} | Meat Machines`,
    description: shortDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/all-products/${slug}`,
      languages
    },
    openGraph: {
      title: `${localizedName} | Meat Machines`,
      description: shortDescription,
      url: `${siteUrl}/${locale}/all-products/${slug}`,
      images: product.photos?.[0] ? [product.photos[0]] : []
    }
  };
}

export default function ProductDetails() {
  return (
    <>
      <h1 className="sr-only">Product Details</h1>
      <Product />
      <RecommendedProducts />
    </>
  );
}