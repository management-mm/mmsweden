'use client';

import { useEffect, useMemo, useState } from 'react';

import { schema } from '@schemas/addProduct';
import { Form, Formik } from 'formik';
import Link from 'next/link';

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

  const handleToggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    dispatch(clearProduct());
  }, [dispatch]);

  useEffect(() => {
    if (!product) {
      setIsOpen(false);
      return;
    }
    handleToggleMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const editHref = useMemo(() => {
    const slug = (product as any)?.slug; // если тип не содержит slug — можно убрать any после правки типов
    return slug
      ? `/admin/all-products/edit-product/${slug}`
      : '/admin/all-products';
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
        <StatusModal title={'Please wait, the product is being added to the website.'}>
          <Loader />
        </StatusModal>
      )}

      {isOpen && isSubmit && (
        <StatusModal
          title={'🎉🎉🎉Great! Your product is now live on the website.'}
          handleToggleMenu={handleToggleMenu}
        >
          <div className="flex w-full gap-[10px]">
            <Link
              className="border-primary text-primary w-[calc((100%-10px)/2)] rounded-[32px] border py-[10px] text-center font-semibold"
              href={editHref}
            >
              Go to added product
            </Link>

            <Link
              className="border-primary text-primary w-[calc((100%-10px)/2)] rounded-[32px] border py-[10px] text-center font-semibold"
              href="/admin/all-products"
            >
              Go to Product List
            </Link>
          </div>
        </StatusModal>
      )}
    </>
  );
};

export default AddProduct;