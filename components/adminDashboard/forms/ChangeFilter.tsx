'use client';

import type { FC } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import { schema } from '@schemas/editFilter';
import {
  Field,
  Form,
  Formik,
  ErrorMessage as FormikErrorMessage,
} from 'formik';

import {
  updateCategory,
  updateIndustry,
  updateManufacturer,
} from '@store/filters/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';

import type { ThunkRejectValue } from '@utils/errors/createThunkRejectValue';

import { filters } from '@enums/filters';

import { SUPPORTED_LOCALES } from '@i18n/config';

interface IChangeFilterProps {
  filterName: filters.Category | filters.Manufacturer | 'industries';
  filterValue: { _id: string; name: string | MultiLanguageString };
}

type ChangeFilterValues = {
  id: string;
  name: string | MultiLanguageString;
};

type FormStatus = {
  submitError: string | null;
};

const isThunkRejectValue = (error: unknown): error is ThunkRejectValue => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  );
};

const getSubmitErrorMessage = (error: unknown): string => {
  if (isThunkRejectValue(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to save changes. Please try again.';
};

const ChangeFilter: FC<IChangeFilterProps> = ({ filterValue, filterName }) => {
  const dispatch = useAppDispatch();

  return (
    <Formik<ChangeFilterValues>
      enableReinitialize
      initialValues={{
        id: filterValue._id,
        name: filterValue.name || '',
      }}
      validationSchema={schema}
      initialStatus={{ submitError: null } as FormStatus}
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus({ submitError: null });

        try {
          switch (filterName) {
            case filters.Category:
              await dispatch(updateCategory(values)).unwrap();
              break;

            case filters.Manufacturer:
              await dispatch(updateManufacturer(values)).unwrap();
              break;

            case 'industries':
              await dispatch(updateIndustry(values)).unwrap();
              break;

            default:
              throw new Error('Unsupported filter type');
          }
        } catch (error) {
          setStatus({
            submitError: getSubmitErrorMessage(error),
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form>
          {status?.submitError && (
            <div
              className="mb-[16px] rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
              role="alert"
              aria-live="polite"
            >
              {status.submitError}
            </div>
          )}

          {(filterName === filters.Category || filterName === 'industries') && (
            <div className="mb-[22px] flex flex-col gap-[12px]">
              {Object.values(SUPPORTED_LOCALES).map(lang => (
                <div key={lang}>
                  <div className="relative">
                    <label className="absolute top-1/2 left-[20px] -translate-y-1/2">
                      <span className="font-openSans text-desc text-[14px]">
                        {lang.toUpperCase()}
                      </span>
                      &nbsp;&nbsp;|
                    </label>

                    <Field
                      className="border-neutral transition-border duration-primary focus:border-secondary-accent w-full rounded-[22px] border py-[14px] pr-[56px] pl-[65px] text-[14px] outline-none focus:border md:h-full"
                      placeholder={`Enter ${filterName} in ${lang.toUpperCase()}`}
                      name={`name.${lang}`}
                      required={lang === 'en'}
                      aria-label={`${filterName} ${lang.toUpperCase()}`}
                    />
                  </div>

                  <FormikErrorMessage name={`name.${lang}`}>
                    {msg => (
                      <p
                        className="mt-1 pl-[8px] text-[12px] text-red-600"
                        role="alert"
                      >
                        {msg}
                      </p>
                    )}
                  </FormikErrorMessage>
                </div>
              ))}
            </div>
          )}

          {filterName === filters.Manufacturer && (
            <div className="mb-[22px]">
              <Field
                className="border-neutral transition-border duration-primary focus:border-secondary-accent w-full rounded-[22px] border py-[14px] pr-[56px] pl-[22px] text-[14px] outline-none focus:border md:h-full"
                placeholder="Enter manufacturer"
                name="name"
                aria-label="Manufacturer name"
              />

              <FormikErrorMessage name="name">
                {msg => (
                  <p
                    className="mt-1 pl-[8px] text-[12px] text-red-600"
                    role="alert"
                  >
                    {msg}
                  </p>
                )}
              </FormikErrorMessage>
            </div>
          )}

          <button
            className="bg-accent w-full rounded-[32px] py-[12px] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ChangeFilter;
