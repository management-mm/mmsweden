import AdminProviders from 'app/providers/AdminProviders';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AdminSharedLayout from '@components/AdminSharedLayout';
import PrivateGate from '@components/routing/PrivateGate';

import { type AppLocale, isAppLocale } from '@i18n/config';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const safeLocale: AppLocale = locale;

  return (
    <AdminProviders locale={safeLocale}>
      <PrivateGate redirectTo={`/${safeLocale}/login`}>
        <AdminSharedLayout>{children}</AdminSharedLayout>
      </PrivateGate>
    </AdminProviders>
  );
}
