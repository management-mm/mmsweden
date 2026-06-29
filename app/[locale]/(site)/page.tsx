import type { Metadata } from 'next';

import AboutUs from '@components/home/aboutUs/AboutUs';
import Hero from '@components/home/hero/Hero';
import Industries from '@components/home/industries/Industries';
import LatestArrivals from '@components/home/latestArrivals/LatestArrivals';
import SellToUs from '@components/home/sellToUs/SellToUs';

import type { AppLocale } from '@i18n/config';
import { getPageSeo } from '@i18n/pageSeo';
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
  const seo = getPageSeo('home', locale);

  return createPageMetadata({
    locale,
    path: '/',
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
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
