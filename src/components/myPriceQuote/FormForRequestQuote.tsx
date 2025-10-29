import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { requestQuote } from '@api/mailerService';
import { schema } from '@schemas/formForRequestQuote';
import axios from 'axios';
import { Form, Formik } from 'formik';

import { LanguageContext } from '@components/SharedLayout';
import Loader from '@components/common/loaders/Loader';
import Company from '@components/formsLabels/Company';
import Email from '@components/formsLabels/Email';
import Message from '@components/formsLabels/Message';
import Name from '@components/formsLabels/Name';
import Country from '@components/formsLabels/countryAndPhone/Country';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { selectRequestedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useNotify } from '@hooks/useNotify';

import getProductName from '@utils/getProductName';

import { Button } from '@enums/i18nConstants';
import { LanguageKeys } from '@enums/languageKeys';

const FormForRequestQuote = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const requestedProducts = useAppSelector(selectRequestedProducts);

  const { language } = useContext(LanguageContext);
  const { notifySuccess, notifyError } = useNotify();

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
                  name: getProductName(name, LanguageKeys.EN),
                  idNumber,
                  photo: photos[0],
                })
              );
              const phone = values.callingCode + values.phone;

              const { name, email, country, countryPhone, company } = values;

              const message = await requestQuote({
                name,
                email,
                phone,
                country,
                countryPhone,
                company,
                products,
              });

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
            <div className="mb-[32px] flex flex-col gap-[14px]">
              <Name />
              <Email />
              <Phone />
              <Country />
              <Company />
              <Message />
            </div>

            <button
              className="mx-auto block w-full rounded-[32px] bg-accent px-[32px] py-[16px] font-semibold text-primary shadow-accent md:w-auto"
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
