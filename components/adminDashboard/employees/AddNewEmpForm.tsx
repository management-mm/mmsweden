'use client';

import { useState } from 'react';

import { Field, Form, Formik } from 'formik';

import { IEditEmployeeFormValues } from './EditEmployeeForm';

import StatusModal from '@components/common/StatusModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: IEditEmployeeFormValues) => void;
}

const inputClassName =
  'border-neutral transition-border duration-primary focus:border-secondary-accent h-fit w-full rounded-[22px] border px-[22px] py-[14px] text-[14px] outline-none md:h-full';

export default function AddNewEmpModal({ isOpen, onClose, onSave }: Props) {
  if (!isOpen) return null;

  return (
    <StatusModal
      title="Add new employee"
      handleToggleMenu={onClose}
      className={'h-fit'}
    >
      <Formik<IEditEmployeeFormValues>
        initialValues={{
          name: '',
          description: '',
          phone: '',
          additionalInfo: '',
          email: '',
        }}
        onSubmit={values => {
          onSave(values);
          onClose();
        }}
      >
        <Form className="flex w-full flex-col gap-3">
          <Field name="name" placeholder="Name" className={inputClassName} />

          <Field
            name="description"
            placeholder="Description"
            className={inputClassName}
          />

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
              onClick={onClose}
              className="rounded-[22px] border border-gray-400 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </Form>
      </Formik>
    </StatusModal>
  );
}
