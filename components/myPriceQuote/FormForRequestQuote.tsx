'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { requestQuote } from '@api/mailerService';
import { schema } from '@schemas/formForRequestQuote';
import axios from 'axios';
import { ErrorMessage, Form, Formik } from 'formik';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';
import Loader from '@components/common/loaders/Loader';
import Company from '@components/formsLabels/Company';
import Email from '@components/formsLabels/Email';
import Name from '@components/formsLabels/Name';
import Country from '@components/formsLabels/countryAndPhone/Country';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';

import getProductName from '@utils/getProductName';

import { Button, Label, Placeholder } from '@enums/i18nConstants';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { DEFAULT_LOCALE } from '@i18n/config';

const FormForRequestQuote = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const requestedProducts = useAppSelector(selectRequestedProducts);
  const { notifySuccess, notifyError } = useNotify();

  const language = useCurrentLocale();

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

              const { name, email, country, countryPhone, company } =
                values;

              const response = await requestQuote({
                name,
                email,
                phone,
                country,
                countryPhone,
                company,
                products,
              });

              notifySuccess(response[language]);
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
              className="bg-accent text-primary shadow-accent mx-auto block w-full rounded-[32px] px-[32px] py-[16px] font-semibold md:w-auto"
              type="submit"
            >
              {t(Button.SubmitRequest)}
            </button>
          </Form>
        </Formik>
      </section>
    </>
  );
};

export default FormForRequestQuote;