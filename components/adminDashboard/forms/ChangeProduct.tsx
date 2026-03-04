'use client';

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
import useMessageDelOrSold from '@hooks/useMessageDelOrSold';
import useWindowWidth from '@hooks/useWindowWidth';

import { IconId } from '@enums/iconsSpriteId';
import { LanguageKeys } from '@enums/languageKeys';

const ChangeProduct = () => {
  const dispatch = useAppDispatch();

  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const productId = useMemo(() => {
    if (!slug) return undefined;
    return slug.split('-').pop();
  }, [slug]);

  const product = useAppSelector(selectProductDetails);
  const isLoading = useAppSelector(selectIsLoading);

  const [isDelete, setIsDelete] = useState(false);
  const windowWidth = useWindowWidth();

  const emptyName = useMemo(() => {
    return Object.values(LanguageKeys).reduce((acc, lang) => {
      acc[lang] = '';
      return acc;
    }, {} as Record<LanguageKeys, string>);
  }, []);

  const [deletionDate, setDeletionDate] = useState<string | null>(null);

  // ✅ синхронизируем deletionDate когда product загрузился/изменился
  useEffect(() => {
    if (product?.deletionDate) {
      setDeletionDate(
        new Date(product.deletionDate).toLocaleString('en', { dateStyle: 'long' })
      );
    } else {
      setDeletionDate(null);
    }
  }, [product?.deletionDate]);

  const [isProductUpdated, setIsProductUpdated] = useState(false);
  const { isMessageOpen, handleToggleMenu } =
    useMessageDelOrSold(isProductUpdated);

  // ✅ deps всегда одной длины и включают все используемые значения
  useEffect(() => {
    if (!slug || !productId) return;
    dispatch(fetchProductBySlug({ slug }));
  }, [dispatch, slug, productId]);

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

  if (isLoading && !isProductUpdated) {
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
              : typeof product.name === 'object' && product.name
                ? { ...emptyName, ...product.name }
                : '',

          idNumber: product.idNumber || '',

          // ⚠️ если схема требует en — лучше тоже так:
          description:
            typeof product.description === 'object' && product.description
              ? { ...emptyName, ...product.description }
              : product.description || {},

          dimensions: product.dimensions || '',
          category: product.category?.en || '',
          manufacturer: product.manufacturer || '',
          industries: product.industries?.map(ind => ind.en) || [],
          condition: product.condition || 'used',
          video: product.video || '',
          photoQueue: product.photos as (string | File)[],
          photos: [] as File[],

          // IMPORTANT: это то, что реально уйдёт на сервер при Sold
          deletionDate: product.deletionDate || null,

          shouldTranslateName: false,
        }}
          validationSchema={schema}
          onSubmit={async values => {
            try {
              if (!productId) return;

              if (isDelete) {
                dispatch(deleteProduct({ productId }));
                return;
              }

              const response = await dispatch(updateProduct(values));
              if (response) setIsProductUpdated(true);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Form>
            <div className={clsx('container', windowWidth > 1178 && 'ml-0')}>
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

                  <Block intent="main" title="Category, Manufacturer, Industry">
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
                      setIsDelete={setIsDelete}
                      isDelete={isDelete}
                      setDeletionDate={
                        setDeletionDate as Dispatch<
                          SetStateAction<string | null | boolean>
                        >
                      }
                      deletionDate={deletionDate}
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
        </Formik>
      )}

      <MessageDeleteOrSold
        title={'Do you want to delete this product?'}
        isDeleteOrDeletionDate={isDelete}
        setIsDeleteOrDeletionDate={
          setIsDelete as Dispatch<SetStateAction<boolean | string | null>>
        }
      />

      <MessageDeleteOrSold
        title={`This product will be deleted on ${deletionDate}. Do you want to mark it as sold?`}
        isDeleteOrDeletionDate={deletionDate}
        setIsDeleteOrDeletionDate={
          setDeletionDate as Dispatch<SetStateAction<boolean | string | null>>
        }
      />

      {isLoading && isProductUpdated && (
        <StatusModal
          title={'Please wait, the product is being uppdated.'}
          handleToggleMenu={handleToggleMenu}
        >
          <Loader />
        </StatusModal>
      )}

      {isMessageOpen && (
        <StatusModal
          title={'🎉🎉🎉Great! Your product is succesfully updated'}
          handleToggleMenu={handleToggleMenu}
        >
          <div className="flex w-full gap-[10px]">
            <Link
              className="border-primary text-primary w-full rounded-[32px] border py-[10px] text-center font-semibold"
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

export default ChangeProduct;