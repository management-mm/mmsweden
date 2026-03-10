import type { Metadata } from 'next';

import Contacts from '@components/contactUs/Contacts';
import Hero from '@components/contactUs/Hero';
import WriteToUsForm from '@components/contactUs/WriteToUsForm';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createPageMetadata({
    locale,
    path: '/contact-us',
    title: 'Contact Us | Meat Machines',
    description:
      'Get in touch with Meat Machines. Our team will answer your questions about food processing machinery.',
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
