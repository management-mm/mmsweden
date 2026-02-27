import LoginForm from '@components/adminDashboard/LoginForm';
import RestrictedGate from '@components/routing/RestrictedGate';

export default function LoginPage() {
  return (
    <RestrictedGate redirectTo="/admin/all-products">
      <LoginForm />
    </RestrictedGate>
  );
}
