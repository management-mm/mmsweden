'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { schema } from '@schemas/editProduct';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Block from '../Block';
import Condition from '../Condition';
import DeleteOrSold from '../DeleteOrSold';
import GeneralInformation from '../GeneralInformation';
import CatManInd from '../catManInd/CatManInd';
import MessageDeleteOrSold from '../common/MessageDeleteOrSold';
import PhotosAndVideo from '../photosAndVideo/PhotosAndVideo';
import SuccessModal from '../statusModals/SuccessModal';

import StatusModal from '@components/common/StatusModal';
import SvgIcon from '@components/common/SvgIcon';
import RetryBlock from '@components/common/error/RetryBlock';
import Loader from '@components/common/loaders/Loader';

import {
  deleteProduct,
  fetchProductBySlug,
  updateProduct,
} from '@store/products/operations';
import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading, selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';
import useWindowWidth from '@hooks/useWindowWidth';

import { AppError } from '@utils/errors/AppError';
import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

import { IconId } from '@enums/iconsSpriteId';

import { AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

const ChangeProduct = () => {
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const product = useAppSelector(selectProductDetails);
  const isLoading = useAppSelector(selectIsLoading);

  const productId = product?._id;

  const [isDelete, setIsDelete] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [soldModalOpen, setSoldModalOpen] = useState(false);
  const [soldDateLabel, setSoldDateLabel] = useState<string | null>(null);
  const [isProductUpdated, setIsProductUpdated] = useState(false);
  const [loadError, setLoadError] = useState<AppError | null>(null);

  const [pendingSold, setPendingSold] = useState<{
    iso: string;
    label: string;
  } | null>(null);

  const { notifyError } = useNotify();

  const editHref = useMemo(() => {
    const productSlug = (product as { slug?: string } | null)?.slug;

    return productSlug
      ? `/admin/all-products/edit-product/${productSlug}`
      : '/admin/all-products';
  }, [product]);

  const emptyName = useMemo(() => {
    return Object.values(SUPPORTED_LOCALES).reduce(
      (acc, lang) => {
        acc[lang] = '';
        return acc;
      },
      {} as Record<AppLocale, string>
    );
  }, []);

  const loadProduct = useCallback(async () => {
    if (!slug) {
      setLoadError(new AppError('Product slug is missing.', 'VALIDATION'));
      return;
    }

    setLoadError(null);
    dispatch(clearProduct());

    try {
      await dispatch(fetchProductBySlug({ slug })).unwrap();
    } catch (error) {
      const normalizedError = normalizeError(error);

      logError(normalizedError, {
        scope: 'fetchProductBySlug',
        details: { slug },
      });

      setLoadError(normalizedError);
    }
  }, [dispatch, slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    if (product?.deletionDate) {
      setSoldDateLabel(
        new Date(product.deletionDate).toLocaleString('en', {
          dateStyle: 'long',
        })
      );
    } else {
      setSoldDateLabel(null);
    }
  }, [product?.deletionDate]);

  if (loadError && !product) {
    return (
      <div className="container pt-[48px] pb-[64px]">
        <RetryBlock
          error={loadError}
          message="Failed to load product data."
          onRetry={loadProduct}
          className="max-w-[560px]"
        />
      </div>
    );
  }

  if (!product && isDelete) {
    return (
      <div className="w-max-screen flex h-[calc(100vh-115px)] w-full items-center justify-center">
        <div>
          <SvgIcon
            className="fill-primary mx-auto mb-[20px] block"
            iconId={IconId.Cancel}
            size={{ width: 90, height: 90 }}
          />
          <p className="mb-6 text-[22px]">There is no product anymore</p>
          <Link
            className="border-primary text-primary mx-auto block w-full rounded-[32px] border px-[10px] py-[10px] text-center font-semibold"
            href="/admin/all-products"
          >
            Go to Product List
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && !product && !isProductUpdated) {
    return <Loader />;
  }

  return (
    <>
      {product && (
        <Formik
          enableReinitialize
          initialValues={{
            id: product._id,
            name:
              typeof product.name === 'string'
                ? product.name
                : product.name
                  ? { ...emptyName, ...product.name }
                  : '',
            idNumber: product.idNumber || '',
            autoGenerateId: true,
            description:
              typeof product.description === 'string'
                ? product.description
                : product.description
                  ? { ...emptyName, ...product.description }
                  : '',
            dimensions: product.dimensions || '',
            manufacturer: product.manufacturer || '',
            industries: product.industries?.map(ind => ind.en) || [],
            condition: product.condition || 'used',
            video: product.video || '',
            photoQueue: (product.photos ?? []) as (string | File)[],
            photos: [] as File[],
            deletionDate: product.deletionDate || null,
            shouldTranslateName: false,
            seoCategoryId: product.seoCategoryId || '',
            seoSubcategoryId: product.seoSubcategoryId || '',
            productCategoryId: product.productCategoryId || '',
          }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (!productId) {
                throw new AppError('Product ID is missing.', 'VALIDATION');
              }

              if (isDelete) {
                await dispatch(deleteProduct({ productId })).unwrap();
                return;
              }

              await dispatch(
                updateProduct({ ...values, id: productId })
              ).unwrap();

              setIsProductUpdated(true);
            } catch (error) {
              const normalizedError = normalizeError(error);

              logError(normalizedError, {
                scope: isDelete ? 'deleteProduct' : 'updateProduct',
                details: {
                  productId,
                  slug,
                },
              });

              notifyError(getErrorMessage(normalizedError));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <>
              <Form>
                <div className={clsx('container', 'container--no-margin')}>
                  <div className="gap-[24px] pt-[48px] lg:flex">
                    <Block intent="main" title="Photos and video">
                      <PhotosAndVideo
                        initialPhotos={product.photos}
                        initialVideo={product.video ?? ''}
                      />
                    </Block>

                    <div className="flex flex-col gap-[24px]">
                      <Block intent="main" title="General Information">
                        <GeneralInformation product={product} />
                      </Block>

                      <Block
                        intent="main"
                        title="Category, Manufacturer, Industry"
                      >
                        <CatManInd
                          initialCategory={product.seoSubcategoryId}
                          initialManufacturer={product.manufacturer}
                          initialIndustries={product.industries}
                        />
                      </Block>

                      <Block intent="main" title="Condition">
                        <Condition initialValue={product.condition} />
                      </Block>

                      <Block
                        intent="main"
                        title="Deleting a product or setting the status to 'Sold'"
                      >
                        <DeleteOrSold
                          isDelete={isDelete}
                          setIsDelete={setIsDelete}
                          formDeletionDate={values.deletionDate}
                          onOpenDeleteModal={() => setDeleteModalOpen(true)}
                          onOpenSoldModal={() => setSoldModalOpen(true)}
                          setPendingSold={setPendingSold}
                          onClearSold={() => {
                            setFieldValue('deletionDate', null, false);
                            setSoldDateLabel(null);
                          }}
                        />

                        {soldDateLabel && (
                          <p className="text-sm text-gray-600">
                            This product will be deleted on {soldDateLabel}.
                          </p>
                        )}
                      </Block>

                      <button
                        className="bg-accent w-full rounded-[32px] py-[16px] disabled:cursor-not-allowed disabled:opacity-70"
                        type="submit"
                        disabled={isLoading || isSubmitting}
                      >
                        {isLoading || isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>

              <MessageDeleteOrSold
                title="Do you want to delete this product?"
                isOpen={deleteModalOpen}
                onYes={() => {
                  setIsDelete(true);
                  setFieldValue('deletionDate', null, false);
                  setSoldDateLabel(null);
                  setDeleteModalOpen(false);
                }}
                onNo={() => {
                  setIsDelete(false);
                  setDeleteModalOpen(false);
                }}
              />

              <MessageDeleteOrSold
                title={
                  pendingSold?.label
                    ? `This product will be deleted on ${pendingSold.label}. Do you want to mark it as sold?`
                    : 'Do you want to mark it as sold?'
                }
                isOpen={soldModalOpen}
                onYes={() => {
                  if (pendingSold) {
                    setFieldValue('deletionDate', pendingSold.iso, false);
                    setSoldDateLabel(pendingSold.label);
                  }

                  setIsDelete(false);
                  setSoldModalOpen(false);
                }}
                onNo={() => setSoldModalOpen(false)}
              />
            </>
          )}
        </Formik>
      )}

      {isLoading && isProductUpdated && (
        <StatusModal
          title="Please wait, the product is being updated."
          handleToggleMenu={() => setIsProductUpdated(false)}
        >
          <Loader />
        </StatusModal>
      )}

      {isProductUpdated && !isLoading && (
        <SuccessModal
          mainMessage="🎉🎉🎉Great! Your product is successfully updated"
          handleToggleMenu={() => setIsProductUpdated(false)}
          statusProduct="updated"
          linkProduct={editHref}
        />
      )}
    </>
  );
};

export default ChangeProduct;
