'use client';

import { useState } from 'react';

import { sellToUs } from '@api/mailerService';
import { schema } from '@schemas/formForSale';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';

import Loader from '@components/common/loaders/Loader';
import AttachPhotos from '@components/formsLabels/AttachPhotos';
import Description from '@components/formsLabels/Description';
import Email from '@components/formsLabels/Email';
import Name from '@components/formsLabels/Name';
import Price from '@components/formsLabels/Price';
import ProductName from '@components/formsLabels/ProductName';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { useNotify } from '@hooks/useNotify';

import { pushToDataLayer } from '@utils/analytics/pushToDataLayer';
import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

import { Button, Title } from '@enums/i18nConstants';

const FormForSale = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const locale = useCurrentLocale();

  return (
    <>
      {loading && <Loader />}

      <section className="pb-[104px] md:pb-[140px]">
        <div className="container">
          <h2 className="text-title mb-[22px] text-center text-[32px] font-bold lg:mb-[48px]">
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
                pushToDataLayer({
                  event: 'sell_to_us_success',
                  form_name: 'sell_to_us',
                  page_type: 'sell_to_us',
                });
                notifySuccess(message[locale]);
                actions.resetForm();
              } catch (error) {
                const normalizedError = normalizeError(error);

                logError(normalizedError, {
                  scope: 'sellToUs',
                  details: {
                    email: values.email,
                    productName: values.productName,
                    locale,
                    photosCount: values.photos.length,
                  },
                });

                notifyError(getErrorMessage(normalizedError));
              } finally {
                setLoading(false);
                actions.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
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
                  className="bg-accent text-primary shadow-accent mx-auto block w-full rounded-[32px] px-[32px] py-[16px] font-semibold disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                  type="submit"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting
                    ? 'Sending...'
                    : t(Button.SubmitRequest)}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
};

export default FormForSale;
