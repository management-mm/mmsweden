import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Loader from '@components/common/loaders/Loader';
import Contacts from '@components/contactUs/Contacts';
import Hero from '@components/contactUs/Hero';

import type { AppLocale } from '@i18n/config';
import { getPageSeo } from '@i18n/pageSeo';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

const WriteToUsForm = dynamic(
  () => import('@components/contactUs/WriteToUsForm'),
  { loading: () => <Loader /> }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPageSeo('contactUs', locale);

  return createPageMetadata({
    locale,
    path: '/contact-us',
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

const ContactUs = () => {
  return (
    <>
      <Hero />
      <Contacts />
      <WriteToUsForm />
    </>
  );
};

export default ContactUs;
