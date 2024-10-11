import { useTranslation } from 'react-i18next';
import { Form } from 'react-router-dom';

import { Formik } from 'formik';
import * as Yup from 'yup';

import Company from '@components/formsLabels/Company';
import Email from '@components/formsLabels/Email';
import Message from '@components/formsLabels/Message';
import Name from '@components/formsLabels/Name';
import Country from '@components/formsLabels/countryAndPhone/Country';
import Phone from '@components/formsLabels/countryAndPhone/Phone';

import { Button, Title } from '@enums/i18nConstants';

const schema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(30, 'Too Long!').required(),
  phone: Yup.number().required(),
  email: Yup.string().required().email(),
  country: Yup.string().required(),
  company: Yup.string().required(),
});

const FormForRequestQuote = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full pb-[96px]">
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          country: '',
          products: [],
          company: [],
        }}
        validationSchema={schema}
        onSubmit={() => {
          console.log('Form has send');
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
  );
};

export default FormForRequestQuote;
