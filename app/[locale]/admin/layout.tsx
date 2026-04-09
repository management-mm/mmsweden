import AdminProviders from 'app/providers/AdminProviders';

import AdminSharedLayout from '@components/AdminSharedLayout';
import PrivateGate from '@components/routing/PrivateGate';

import type { AppLocale } from '@i18n/config';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as AppLocale;

  return (
    <AdminProviders locale={safeLocale}>
      <PrivateGate redirectTo="/login">
        <AdminSharedLayout>{children}</AdminSharedLayout>
      </PrivateGate>
    </AdminProviders>
  );
}
