import AdminProvider from '@components/AdminProvider';
import AdminSharedLayout from '@components/AdminSharedLayout';

import PrivateGate from '@components/routing/PrivateGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateGate redirectTo="/login">
      <AdminProvider>
        <AdminSharedLayout>{children}</AdminSharedLayout>
      </AdminProvider>
    </PrivateGate>
  );
}
