import AdminSharedLayout from '@components/AdminSharedLayout';
import PrivateGate from '@components/routing/PrivateGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateGate redirectTo="/login">
      <AdminSharedLayout>{children}</AdminSharedLayout>
    </PrivateGate>
  );
}
