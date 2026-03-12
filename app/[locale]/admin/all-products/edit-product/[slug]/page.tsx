import Loader from '@components/common/loaders/Loader';
import dynamic from 'next/dynamic';

const ChangeProduct = dynamic(
  () => import('@components/adminDashboard/forms/ChangeProduct'),
  {
    loading: () => <Loader />,
  }
);

export default function EditProduct() {
  return (
    <>
      <ChangeProduct />
    </>
  );
}
