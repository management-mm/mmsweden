'use client';

import type { FC } from 'react';

import { IEmployee } from '@interfaces/IEmployee';
import { MultiLanguageString } from '@interfaces/IProduct';
import { Field, Form, Formik } from 'formik';

import MultiLangField from './MultiLangField';

import { AppLocale } from '@i18n/config';

interface IEditEmployeeFormValues {
  name: string | MultiLanguageString;
  description: string | MultiLanguageString;
  phone: string;
  additionalInfo: string;
  email: string;
}

interface IEditEmployeeFormProps {
  setIsEditing: (value: boolean) => void;
  language: AppLocale;
  currentName: MultiLanguageString;
  currentDescription: MultiLanguageString;
  employee: IEmployee;
  onRequestSave: (values: IEditEmployeeFormValues) => void;
}

const inputClassName =
  'border-neutral transition-border duration-primary focus:border-secondary-accent h-fit w-full rounded-[22px] border px-[22px] py-[14px] pr-[56px] text-[14px] outline-none md:h-full';

const EditEmployeeForm: FC<IEditEmployeeFormProps> = ({
  setIsEditing,
  employee,
  currentName,
  currentDescription,
  onRequestSave,
}) => {
  return (
    <Formik<IEditEmployeeFormValues>
      initialValues={{
        name: currentName,
        description: currentDescription,
        phone: employee.phone ?? '',
        additionalInfo: employee.additionalInfo ?? '',
        email: employee.email ?? '',
      }}
      enableReinitialize
      onSubmit={values => {
        onRequestSave(values);
      }}
    >
      <Form className="flex w-full flex-col gap-3">
        <MultiLangField fieldName="name" value={currentName} />

        <MultiLangField fieldName="description" value={currentDescription} />

        <Field name="phone" placeholder="Phone" className={inputClassName} />

        <Field
          name="additionalInfo"
          placeholder="Additional info"
          className={inputClassName}
        />

        <Field
          name="email"
          type="email"
          placeholder="Email"
          className={inputClassName}
        />

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            className="bg-primary rounded-[22px] px-4 py-2 text-white"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-[22px] border border-gray-400 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default EditEmployeeForm;
export type { IEditEmployeeFormValues };
