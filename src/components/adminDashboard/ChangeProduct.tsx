import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { schema } from '@schemas/editProduct';
import { Form, Formik } from 'formik';

import Block from './Block';
import CatManInd from './CatManInd';
import Condition from './Condition';
import DeleteOrSold from './DeleteOrSold';
import GeneralInformation from './GeneralInformation';
import PhotosAndVideo from './PhotosAndVideo';

import {
  deleteProduct,
  fetchProductById,
  updateProduct,
} from '@store/products/operations';
import { selectProductDetails } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

const ChangeProduct = () => {
  const dispatch = useAppDispatch();
  const { productId } = useParams();
  const product = useAppSelector(selectProductDetails);
  const isLoading = useAppSelector(state => state.products.isLoading);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById({ productId }));
  }, [dispatch, productId]);

  if (isLoading || !product) {
    return <div>Loading...</div>;
  }
  
  return (
    <Formik
      initialValues={{
        id: product._id,
        name: product.name || '',
        idNumber: product.idNumber || '',
        description: product.description || {},
        dimensions: product.dimensions || '',
        category: product.category.en || '',
        manufacturer: product.manufacturer || '',
        industries: product.industries.map(industry => industry.en) || [],
        condition: product.condition || 'used',
        video: product.video || '',
        photoQueue: product.photos as (string | File)[],
        photos: [] as File[],
        deletionDate: product.deletionDate || null,
      }}
      validationSchema={schema}
      onSubmit={async values => {
        try {
          if (isDelete) {
            console.log(isDelete);
            alert('Form submitted');
            dispatch(deleteProduct({ productId }));
          }

          console.log(values);
          alert('Form submitted');
          dispatch(updateProduct(values));
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <Form>
        <div className="container">
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
                <DeleteOrSold setIsDelete={setIsDelete} isDelete={isDelete} />
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
  );
};

export default ChangeProduct;
