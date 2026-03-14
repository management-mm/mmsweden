import dynamic from 'next/dynamic';

import Loader from '@components/common/loaders/Loader';

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
