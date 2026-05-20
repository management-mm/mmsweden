import VerifyCodeForm from '@components/adminDashboard/forms/VerifyCodeForm';
import RestrictedGate from '@components/routing/RestrictedGate';

const VerifyCodePage = () => {
  return (
    <RestrictedGate redirectTo="/admin/all-products">
      <VerifyCodeForm />
    </RestrictedGate>
  );
};

export default VerifyCodePage;
