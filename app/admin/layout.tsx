import AdminSharedLayout from '@components/AdminSharedLayout';
import LanguageAdminProvider from '@components/LanguageAdminProvider';
import PrivateGate from '@components/routing/PrivateGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateGate redirectTo="/login">
      <LanguageAdminProvider>
        <AdminSharedLayout>{children}</AdminSharedLayout>
      </LanguageAdminProvider>
    </PrivateGate>
  );
}
