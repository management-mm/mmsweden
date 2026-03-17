import { Suspense } from 'react';

import type { Metadata } from 'next';

import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/',
    title: 'Used Food Processing and Packaging Equipment | Meat Machines',
    description:
      'Meat Machines supplies used food processing and packaging equipment for the food industry. Browse nearly 2,000 machines in stock.',
    keywords: [
      'used food processing equipment',
      'used packaging equipment',
      'food machinery',
      'meat processing equipment',
      'used food machinery',
    ],
  });
}

const HomePage = async ({ params }: Props) => {
  const { locale } = await params;
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/${locale}`;

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Meat Machines',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Meat Machines',
    url: homeUrl,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <Hero />
      <Industries />
      <AboutUs />
      <SellToUs />
      <Suspense fallback={null}>
        <LatestArrivals />
      </Suspense>
    </>
  );
};

export default HomePage;
