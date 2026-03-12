import Loader from '@components/common/loaders/Loader';
import dynamic from 'next/dynamic';

const AddProduct = dynamic(
  () => import('@components/adminDashboard/forms/AddProduct'),
  {
    loading: () => <Loader />,
  }
);

export default function NewProduct() {
  return <AddProduct />;
}