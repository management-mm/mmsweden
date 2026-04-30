'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { getNextProductId } from '@api/countersService';
import { schema } from '@schemas/addProduct';
import { Form, Formik } from 'formik';

import Block from '../Block';
import Condition from '../Condition';
import GeneralInformation from '../GeneralInformation';
import CatManInd from '../catManInd/CatManInd';
import PhotosAndVideo from '../photosAndVideo/PhotosAndVideo';
import SuccessModal from '../statusModals/SuccessModal';

import StatusModal from '@components/common/StatusModal';
import RetryBlock from '@components/common/error/RetryBlock';
import Loader from '@components/common/loaders/Loader';

import { type IAddProductData, addProduct } from '@store/products/operations';
import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading, selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';

import { cn } from '@utils/cn';
import { AppError } from '@utils/errors/AppError';
import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const product = useAppSelector(selectProductDetails);
  const { notifyError } = useNotify();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [initialIdNumber, setInitialIdNumber] = useState<number | null>(null);
  const [idError, setIdError] = useState<AppError | null>(null);

  const handleToggleMenu = () => setIsOpen(prev => !prev);

  useEffect(() => {
    dispatch(clearProduct());
  }, [dispatch]);

  const loadId = useCallback(async () => {
    setIdError(null);

    try {
      const id = await getNextProductId();
      setInitialIdNumber(id);
    } catch (error) {
      const normalizedError = normalizeError(error);

      logError(normalizedError, {
        scope: 'getNextProductId',
      });

      setIdError(normalizedError);
    }
  }, []);

  useEffect(() => {
    loadId();
  }, [loadId]);

  useEffect(() => {
    setIsOpen(Boolean(product));
  }, [product]);

  const editHref = useMemo(() => {
    const slug = (product as { slug?: string } | null)?.slug;

    return slug
      ? `/admin/all-products/edit-product/${slug}`
      : '/admin/all-products';
  }, [product]);

  if (idError) {
    return (
      <div
        className={cn(
          'container',
          'container--no-margin',
          'pt-[48px] pb-[64px]'
        )}
      >
        <RetryBlock
          error={idError}
          message="Failed to load the next product ID."
          onRetry={loadId}
          className="max-w-[520px]"
        />
      </div>
    );
  }

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
          notes: '',
          isDraft: false,
        }}
        validationSchema={schema}
        onSubmit={async (values: IAddProductData, { setSubmitting }) => {
          setIsSubmit(false);

          try {
            await dispatch(addProduct(values)).unwrap();
            setIsSubmit(true);
          } catch (error) {
            const normalizedError = normalizeError(error);

            logError(normalizedError, {
              scope: 'addProduct',
              details: {
                idNumber: values.idNumber,
              },
            });

            notifyError(getErrorMessage(normalizedError));
            setIsSubmit(false);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className={cn('container', 'container--no-margin')}>
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

                  <div className="flex items-center gap-[8px]">
                    <button
                      className="border-primary w-full rounded-[32px] border py-[14px] disabled:cursor-not-allowed disabled:opacity-70"
                      type="submit"
                      onClick={() => setFieldValue('isDraft', true)}
                      disabled={isLoading || isSubmitting}
                    >
                      {isLoading || isSubmitting
                        ? 'Saving...'
                        : 'Save as draft'}
                    </button>

                    <button
                      className="bg-accent w-full rounded-[32px] py-[14px] disabled:cursor-not-allowed disabled:opacity-70"
                      type="submit"
                      onClick={() => setFieldValue('isDraft', false)}
                      disabled={isLoading || isSubmitting}
                    >
                      {isLoading || isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {isLoading && (
        <StatusModal title="Please wait, the product is being added to the website.">
          <div className="border-primary mt-[32px] h-[40px] w-[40px] animate-spin rounded-full border-4 border-t-transparent" />
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
