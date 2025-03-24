import { useTranslation } from 'react-i18next';

import { contactUs } from '@api/mailerService';
import { schema } from '@schemas/writeToUs';
import { Form, Formik } from 'formik';

import Email from '@components/formsLabels/Email';
import Message from '@components/formsLabels/Message';
import Name from '@components/formsLabels/Name';
import Subject from '@components/formsLabels/Subject';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { useNotify } from '@hooks/useNotify';

import { Button, Description, Title } from '@enums/i18nConstants';

const WriteToUsForm = () => {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useNotify();

  return (
    <section className="pb-[104px] md:pb-[140px]">
      <div className="container">
        <h2 className="mb-[6px] text-center text-[32px] font-bold md:text-[48px]">
          {t(Title.WriteToUs)}
        </h2>
        <p className="mb-[22px] text-center text-[14px] font-medium text-desc md:mb-[48px]">
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
              notifySuccess(response);
              actions.resetForm();
            } catch (error) {
              console.log(error);
              notifyError('Oops... Something went wrong');
            }
          }}
        >
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

export default WriteToUsForm;
