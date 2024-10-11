import { useTranslation } from 'react-i18next';

import { schema } from '@schemas/formForSale';
import { Form, Formik } from 'formik';

import AttachPhotos from '@components/formsLabels/AttachPhotos';
import Description from '@components/formsLabels/Description';
import Email from '@components/formsLabels/Email';
import Name from '@components/formsLabels/Name';
import Price from '@components/formsLabels/Price';
import ProductName from '@components/formsLabels/ProductName';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { Button, Title } from '@enums/i18nConstants';

const FormForSale = () => {
  const { t } = useTranslation();

  return (
    <section className="pb-[104px] md:pb-[140px]">
      <div className="container">
        <h2 className="mb-[22px] text-center text-[32px] font-bold text-title lg:mb-[48px]">
          {t(Title.FormForSale)}
        </h2>
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            productName: '',
            price: '',
            description: '',
            photos: [],
          }}
          validationSchema={schema}
          onSubmit={() => {
            console.log('Form has send');
          }}
        >
          <Form>
            <div className="mb-[32px] md:flex md:gap-[30px]">
              <div className="mb-[22px] flex flex-col gap-[22px] md:mb-0 md:w-[calc((100%-30px)/2)]">
                <Name />
                <Email />
                <Phone />
                <ProductName />
                <Price />
              </div>

              <Description />
            </div>

            <AttachPhotos />
            <button
              className="mx-auto block w-full rounded-[32px] bg-accent px-[32px] py-[16px] font-semibold text-primary shadow-accent md:w-auto"
              type="submit"
            >
              {t(Button.SubmitRequest)}
            </button>
          </Form>
        </Formik>
      </div>
    </section>
  );
};

export default FormForSale;
