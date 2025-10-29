import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { sellToUs } from '@api/mailerService';
import { schema } from '@schemas/formForSale';
import axios from 'axios';
import { Form, Formik } from 'formik';

import { LanguageContext } from '@components/SharedLayout';
import Loader from '@components/common/loaders/Loader';
import AttachPhotos from '@components/formsLabels/AttachPhotos';
import Description from '@components/formsLabels/Description';
import Email from '@components/formsLabels/Email';
import Name from '@components/formsLabels/Name';
import Price from '@components/formsLabels/Price';
import ProductName from '@components/formsLabels/ProductName';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { useNotify } from '@hooks/useNotify';

import { Button, Title } from '@enums/i18nConstants';

const FormForSale = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);
  const { notifySuccess, notifyError } = useNotify();

  return (
    <>
      {loading && <Loader />}
      <section className="pb-[104px] md:pb-[140px]">
        <div className="container">
          <h2 className="mb-[22px] text-center text-[32px] font-bold text-title lg:mb-[48px]">
            {t(Title.FormForSale)}
          </h2>
          <Formik
            initialValues={{
              name: '',
              email: '',
              callingCode: '',
              phone: '',
              countryPhone: '',
              productName: '',
              price: '',
              description: '',
              photos: [],
            }}
            validationSchema={schema}
            onSubmit={async (values, actions) => {
              try {
                setLoading(true);
                const phone = values.callingCode + values.phone;

                const {
                  name,
                  email,
                  productName,
                  countryPhone,
                  price,
                  description,
                  photos,
                } = values;

                const formData = new FormData();

                formData.append('name', name);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('productName', productName);
                formData.append('countryPhone', countryPhone);
                formData.append('price', price);
                formData.append('description', description);

                for (let i = 0; i < photos.length; i++) {
                  formData.append('photos', photos[i]);
                }

                const message = await sellToUs(formData);

                notifySuccess(message[language]);
                actions.resetForm();
              } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                  notifyError(
                    error.response?.data?.message ||
                      'Oops... Something went wrong'
                  );
                } else {
                  notifyError('Unexpected error occurred');
                }
              } finally {
                setLoading(false);
              }
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
    </>
  );
};

export default FormForSale;
