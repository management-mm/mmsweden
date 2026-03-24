'use client';

import type { FC } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import { schema } from '@schemas/editFilter';
import { Field, Form, Formik } from 'formik';

import {
  updateCategory,
  updateIndustry,
  updateManufacturer,
} from '@store/filters/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';

import { filters } from '@enums/filters';

import { SUPPORTED_LOCALES } from '@i18n/config';

interface IChangeFilterProps {
  filterName: filters.Category | filters.Manufacturer | 'industries';
  filterValue: { _id: string; name: string | MultiLanguageString };
}

const ChangeFilter: FC<IChangeFilterProps> = ({ filterValue, filterName }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          id: filterValue._id,
          name: filterValue.name || '',
        }}
        validationSchema={schema}
        onSubmit={async values => {
          try {
            switch (filterName) {
              case filters.Category:
                dispatch(updateCategory(values));
                return;
              case filters.Manufacturer:
                dispatch(updateManufacturer(values));
                return;
              case 'industries':
                dispatch(updateIndustry(values));
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form>
          {(filterName === filters.Category || filterName === 'industries') && (
            <label className="mb-[22px] flex flex-col gap-[12px]">
              {Object.values(SUPPORTED_LOCALES).map(lang => (
                <div key={lang} className="relative">
                  <label
                    className={'absolute top-1/2 left-[20px] -translate-y-1/2'}
                  >
                    <span className={'font-openSans text-desc text-[14px]'}>
                      {lang.toUpperCase()}
                    </span>
                    &nbsp;&nbsp;|
                  </label>
                  <Field
                    className={
                      'border-neutral transition-border duration-primary focus:border-secondary-accent w-full rounded-[22px] border py-[14px] pr-[56px] pl-[65px] text-[14px] outline-none focus:border md:h-full'
                    }
                    placeholder={`Enter ${filterName} in ${lang.toUpperCase()}`}
                    name={`name.${lang}`}
                    required={lang === 'en'}
                  />
                </div>
              ))}
            </label>
          )}
          {filterName === filters.Manufacturer && (
            <Field
              className={
                'border-neutral transition-border duration-primary focus:border-secondary-accent mb-[22px] w-full rounded-[22px] border py-[14px] pr-[56px] pl-[22px] text-[14px] outline-none focus:border md:h-full'
              }
              placeholder={'Enter manufacturer'}
              name={'name'}
            />
          )}
          <button
            className="bg-accent w-full rounded-[32px] py-[12px]"
            type="submit"
          >
            Save
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default ChangeFilter;
