import { schema } from '@schemas/addProduct';
import { Form, Formik } from 'formik';
import Block from './Block';
import CatManInd from './CatManInd';
import Condition from './Condition';
import GeneralInformation from './GeneralInformation';
import PhotosAndVideo from './PhotosAndVideo';

import { type IAddProductData, addProduct } from '@store/products/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';

import { cn } from '@utils/cn';

const AddProduct = () => {
  const dispatch = useAppDispatch();

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
          industries: '',
          condition: 'used',
          photos: [],
          video: '',
          shouldTranslateName: false,
        }}
        validationSchema={schema}
        onSubmit={async (values: IAddProductData) => {
          try {
            alert('Form submitted');
            dispatch(addProduct(values));
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form>
          <div className={cn('container', 'lg:ml-0')}>
            <div className="gap-[24px] pt-[48px] lg:flex">
              <Block title="Photos and video" intent="main">
                <PhotosAndVideo />
              </Block>
              <div>
                <Block title="General Information" intent="main">
                  <GeneralInformation />
                </Block>
                <Block title="Category, Manufacturer, Industry" intent="main">
                  <CatManInd />
                </Block>
                <Block title="Condition" intent="main">
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
    </>
  );
};

export default AddProduct;
