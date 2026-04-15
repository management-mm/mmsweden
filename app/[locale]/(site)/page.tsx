import type { Metadata } from 'next';

import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

import type { AppLocale } from '@i18n/config';
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  getSiteUrl,
  serializeJsonLd,
} from '@i18n/schema';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

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

  const organizationJsonLd = buildOrganizationSchema(siteUrl);
  const websiteJsonLd = buildWebsiteSchema(siteUrl, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(websiteJsonLd),
        }}
      />

      <Hero />
      <Industries />
      <AboutUs />
      <SellToUs />
      <LatestArrivals locale={locale} />
    </>
  );
};

export default HomePage;
