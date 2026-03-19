'use client';

import { useEffect, useMemo, useState } from 'react';

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
import Loader from '@components/common/loaders/Loader';

import {
  deleteProduct,
  fetchProductBySlug,
  updateProduct,
} from '@store/products/operations';
import { selectIsLoading, selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';
import useWindowWidth from '@hooks/useWindowWidth';

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
  const { notifyError } = useNotify();

  const [soldDateLabel, setSoldDateLabel] = useState<string | null>(null);
  const [pendingSold, setPendingSold] = useState<{
    iso: string;
    label: string;
  } | null>(null);

  const editHref = useMemo(() => {
    const slug = (product as any)?.slug;
    return slug
      ? `/admin/all-products/edit-product/${slug}`
      : '/admin/all-products';
  }, [product]);

  const [isProductUpdated, setIsProductUpdated] = useState(false);

  const emptyName = useMemo(() => {
    return Object.values(SUPPORTED_LOCALES).reduce(
      (acc, lang) => {
        acc[lang] = '';
        return acc;
      },
      {} as Record<AppLocale, string>
    );
  }, []);

  useEffect(() => {
    if (!slug) return;
    dispatch(fetchProductBySlug({ slug }));
  }, [dispatch, slug]);

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

  if (isLoading && !isProductUpdated) return <Loader />;

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

            category:
              typeof product.category === 'string'
                ? product.category
                : product.category
                  ? { ...emptyName, ...product.category }
                  : '',

            manufacturer: product.manufacturer || '',

            industries: product.industries?.map(ind => ind.en) || [],

            condition: product.condition || 'used',
            video: product.video || '',

            photoQueue: (product.photos ?? []) as (string | File)[],
            photos: [] as File[],

            deletionDate: product.deletionDate || null,
            shouldTranslateName: false,
          }}
          validationSchema={schema}
          onSubmit={async values => {
            console.log(values);
            try {
              if (!productId) return;

              if (isDelete) {
                await dispatch(deleteProduct({ productId }));
                return;
              }

              const response = await dispatch(
                updateProduct({ ...values, id: productId })
              );

              if (response) setIsProductUpdated(true);
            } catch (error: any) {
              notifyError(error?.message || 'Oops... Something went wrong');
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <>
              <Form>
                <div
                  className={clsx('container', windowWidth > 1178 && 'ml-0')}
                >
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
                          initialCategory={product.category.en}
                          initialManufacturer={product.manufacturer}
                          initialIndustries={product.industries}
                        />
                      </Block>

                      <Block intent="main" title="Condition">
                        <Condition initialValue={product?.condition} />
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
          title="Please wait, the product is being uppdated."
          handleToggleMenu={() => setIsProductUpdated(false)}
        >
          <Loader />
        </StatusModal>
      )}

      {isProductUpdated && !isLoading && (
        <SuccessModal
          mainMessage={'🎉🎉🎉Great! Your product is succesfully updated'}
          handleToggleMenu={() => setIsProductUpdated(false)}
          statusProduct={'updated'}
          linkProduct={editHref}
        />
      )}
    </>
  );
};

export default ChangeProduct;
