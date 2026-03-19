'use client';

import { useEffect, useMemo, useState } from 'react';

import { getNextProductId } from '@api/countersService';
import { schema } from '@schemas/addProduct';
import axios from 'axios';
import { Form, Formik } from 'formik';

import Block from '../Block';
import Condition from '../Condition';
import GeneralInformation from '../GeneralInformation';
import CatManInd from '../catManInd/CatManInd';
import PhotosAndVideo from '../photosAndVideo/PhotosAndVideo';
import SuccessModal from '../statusModals/SuccessModal';

import StatusModal from '@components/common/StatusModal';
import Loader from '@components/common/loaders/Loader';

import { type IAddProductData, addProduct } from '@store/products/operations';
import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading, selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';

import { cn } from '@utils/cn';

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const product = useAppSelector(selectProductDetails);
  const { notifyError } = useNotify();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [initialIdNumber, setInitialIdNumber] = useState<number | null>(null);

  const handleToggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    dispatch(clearProduct());
  }, [dispatch]);

  useEffect(() => {
    const loadId = async () => {
      try {
        const id = await getNextProductId();
        setInitialIdNumber(id);
      } catch (error) {
        console.error('Failed to fetch next product id', error);
      }
    };

    loadId();
  }, []);

  useEffect(() => {
    if (!product) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  }, [product]);

  const editHref = useMemo(() => {
    const slug = (product as any)?.slug;

    return slug
      ? `/admin/all-products/edit-product/${slug}`
      : '/admin/all-products';
  }, [product]);

  if (initialIdNumber === null) {
    return <Loader />;
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          name: '',
          idNumber: initialIdNumber.toString(),
          autoGenerateId: true,
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
            setIsSubmit(true);

            await dispatch(addProduct(values)).unwrap();
          } catch (error: any) {
            notifyError(error?.message || 'Oops... Something went wrong');
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
                  className="bg-accent w-full rounded-[32px] py-[16px]"
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
        <StatusModal title="Please wait, the product is being added to the website.">
          <Loader />
        </StatusModal>
      )}

      {isOpen && isSubmit && (
        <SuccessModal
          mainMessage="🎉🎉🎉Great! Your product is now live on the website."
          handleToggleMenu={handleToggleMenu}
          statusProduct="added"
          linkProduct={editHref}
        />
      )}
    </>
  );
};

export default AddProduct;
