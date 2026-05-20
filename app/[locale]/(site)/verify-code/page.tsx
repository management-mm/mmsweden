import VerifyCodeForm from '@components/adminDashboard/forms/VerifyCodeForm';
import RestrictedGate from '@components/routing/RestrictedGate';

const VerifyCodePage = () => {
  return (
    <RestrictedGate redirectTo="/admin">
      <VerifyCodeForm />
    </RestrictedGate>
  );
};

export default VerifyCodePage;
