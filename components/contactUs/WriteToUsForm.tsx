'use client';

import { useState } from 'react';

import { contactUs } from '@api/mailerService';
import { schema } from '@schemas/writeToUs';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';

import Loader from '@components/common/loaders/Loader';
import Email from '@components/formsLabels/Email';
import Message from '@components/formsLabels/Message';
import Name from '@components/formsLabels/Name';
import Subject from '@components/formsLabels/Subject';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { useNotify } from '@hooks/useNotify';

import { pushToDataLayer } from '@utils/analytics/pushToDataLayer';
import { getErrorMessage } from '@utils/errors/getErrorMessage';
import { logError } from '@utils/errors/logError';
import { normalizeError } from '@utils/errors/normalizeError';

import { Button, Description, Title } from '@enums/i18nConstants';

const WriteToUsForm = () => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const locale = useCurrentLocale();

  return (
    <>
      {loading && <Loader />}

      <section className="pb-[104px] md:pb-[140px]">
        <div className="container">
          <h2 className="mb-[6px] text-center text-[32px] font-bold md:text-[48px]">
            {t(Title.WriteToUs)}
          </h2>

          <p className="text-desc mb-[22px] text-center text-[14px] font-medium md:mb-[48px]">
            {t(Description.WriteToUs)}
          </p>

          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              callingCode: '',
              countryPhone: '',
              subject: '',
              message: '',
            }}
            validationSchema={schema}
            onSubmit={async (values, actions) => {
              try {
                setLoading(true);

                const phone = values.callingCode + values.phone;
                const { name, email, countryPhone, subject, message } = values;

                const response = await contactUs({
                  name,
                  email,
                  phone,
                  countryPhone,
                  subject,
                  message,
                });
                pushToDataLayer({
                  event: 'contact_success',
                  form_name: 'contact',
                  page_type: 'contact',
                });
                notifySuccess(response[locale]);
                actions.resetForm();
              } catch (error) {
                const normalizedError = normalizeError(error);

                logError(normalizedError, {
                  scope: 'contactUs',
                  details: {
                    email: values.email,
                    subject: values.subject,
                    locale,
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
                <div className="mb-[22px]">
                  <div className="mb-[22px] flex flex-col flex-wrap gap-[14px] md:flex-row md:gap-x-[30px] md:gap-y-[22px]">
                    <Name className="md:w-[calc((100%-30px)/2)]" />
                    <Email className="md:w-[calc((100%-30px)/2)]" />
                    <Phone className="md:w-[calc((100%-30px)/2)]" />
                    <Subject className="md:w-[calc((100%-30px)/2)]" />
                  </div>

                  <Message />
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
        </div>
      </section>
    </>
  );
};

export default WriteToUsForm;
