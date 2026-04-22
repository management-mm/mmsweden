'use client';

import { useState } from 'react';

import { requestQuote } from '@api/mailerService';
import { schema } from '@schemas/formForRequestQuote';
import { ErrorMessage, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';
import Loader from '@components/common/loaders/Loader';
import Company from '@components/formsLabels/Company';
import Email from '@components/formsLabels/Email';
import Name from '@components/formsLabels/Name';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { useNotify } from '@hooks/useNotify';

import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';
import getProductName from '@utils/getProductName';

import { Button, Label, Placeholder } from '@enums/i18nConstants';

import { DEFAULT_LOCALE } from '@i18n/config';

const Country = dynamic(
  () => import('@components/formsLabels/countryAndPhone/Country')
);
const Phone = dynamic(
  () => import('@components/formsLabels/countryAndPhone/Phone')
);

const FormForRequestQuote = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const requestedProducts = useAppSelector(selectRequestedProducts);
  const { notifySuccess, notifyError } = useNotify();

  const locale = useCurrentLocale();

  return (
    <>
      {loading && <Loader />}

      <section className="w-full pb-[96px]">
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            countryPhone: '',
            callingCode: '',
            country: '',
            products: [],
            company: '',
            message: '',
          }}
          validationSchema={schema}
          onSubmit={async (values, actions) => {
            try {
              setLoading(true);

              const products = requestedProducts.map(
                ({ name, idNumber, photos }) => ({
                  name: getProductName(name, DEFAULT_LOCALE),
                  idNumber,
                  photo: photos[0],
                })
              );

              const phone = values.callingCode + values.phone;

              const { name, email, country, countryPhone, company, message } =
                values;

              const response = await requestQuote({
                name,
                email,
                phone,
                country,
                countryPhone,
                company,
                message,
                products,
              });

              notifySuccess(response[locale]);
              actions.resetForm();
            } catch (error) {
              const normalizedError = normalizeError(error);

              logError(normalizedError, {
                scope: 'requestQuote',
                details: {
                  email: values.email,
                  company: values.company,
                  locale,
                  productsCount: requestedProducts.length,
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
              <div className="mb-[32px] flex flex-col gap-[14px]">
                <Name />
                <Email />
                <Phone />
                <Country />
                <Company />

                <label className="flex flex-col gap-[2px]">
                  <LabelTitle title={Label.Message} />

                  <InputField
                    name="message"
                    as="textarea"
                    placeholder={Placeholder.Message}
                    className="h-[180px] rounded-[22px]"
                  />

                  <ErrorMessage name="message">
                    {msg => (
                      <div className="mt-1 text-sm text-red-500">{msg}</div>
                    )}
                  </ErrorMessage>
                </label>
              </div>

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
      </section>
    </>
  );
};

export default FormForRequestQuote;
