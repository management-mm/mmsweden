import dynamic from 'next/dynamic';

import Loader from '@components/common/loaders/Loader';

const AddProduct = dynamic(
  () => import('@components/adminDashboard/forms/AddProduct'),
  {
    loading: () => <Loader />,
  }
);

export default function NewProduct() {
  return <AddProduct />;
}
