import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { schema } from '@schemas/addProduct';
import { Form, Formik } from 'formik';

import Block from '../Block';
import Condition from '../Condition';
import GeneralInformation from '../GeneralInformation';
import CatManInd from '../catManInd/CatManInd';
import PhotosAndVideo from '../photosAndVideo/PhotosAndVideo';

import StatusModal from '@components/common/StatusModal';
import Loader from '@components/common/loaders/Loader';

import { type IAddProductData, addProduct } from '@store/products/operations';
import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading, selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { cn } from '@utils/cn';

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const product = useAppSelector(selectProductDetails);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    dispatch(clearProduct());
  }, [dispatch]);

  useEffect(() => {
    if (!product) {
      setIsOpen(false);
      return;
    }
    handleToggleMenu();
  }, [product]);

  if (!product && isLoading && !isSubmit) {
    return <Loader />;
  }

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          idNumber: '',
          description: '',
          dimensions: '',
          category: '',
          manufacturer: '',
          industries: [],
          condition: 'used',
          photos: [],
          video: '',
          shouldTranslateName: false,
        }}
        validationSchema={schema}
        onSubmit={async (values: IAddProductData) => {
          try {
            console.log(values);
            setIsSubmit(true);
            dispatch(addProduct(values));
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form>
          <div className={cn('container', 'lg:ml-0')}>
            <div className="gap-[24px] pt-[48px] lg:flex">
              <Block
                title="Photos and video"
                intent="main"
                className="mb-[20px] lg:mb-0"
              >
                <PhotosAndVideo />
              </Block>
              <div className="pb-[64px]">
                <Block
                  title="General Information"
                  intent="main"
                  className="mb-[20px]"
                >
                  <GeneralInformation />
                </Block>
                <Block
                  title="Category, Manufacturer, Industry"
                  intent="main"
                  className="mb-[20px]"
                >
                  <CatManInd />
                </Block>
                <Block title="Condition" intent="main" className="mb-[20px]">
                  <Condition />
                </Block>
                <button
                  className="w-full rounded-[32px] bg-accent py-[16px]"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
      {isLoading && (
        <StatusModal
          title={'Please wait, the product is being added to the website.'}
        >
          <Loader />
        </StatusModal>
      )}
      {isOpen && isSubmit && (
        <StatusModal
          title={'🎉🎉🎉Great! Your product is now live on the website.'}
          handleToggleMenu={handleToggleMenu}
        >
          <div className="flex w-full gap-[10px]">
            <NavLink
              className={
                'w-[calc((100%-10px)/2)] rounded-[32px] border border-primary py-[10px] text-center font-semibold text-primary'
              }
              to={`/admin/all-products/edit-product/${product?._id}`}
            >
              Go to added product
            </NavLink>
            <NavLink
              className={
                'w-[calc((100%-10px)/2)] rounded-[32px] border border-primary py-[10px] text-center font-semibold text-primary'
              }
              to="/admin/all-products"
            >
              Go to Product List
            </NavLink>
          </div>
        </StatusModal>
      )}
    </>
  );
};

export default AddProduct;
