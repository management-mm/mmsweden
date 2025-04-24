import { schema } from '@schemas/editFilter';
import { Field, Form, Formik } from 'formik';

import {
  updateCategory,
  updateIndustry,
  updateManufacturer,
} from '@store/filters/operations';

import { useAppDispatch } from '@hooks/useAppDispatch';

import { filters } from '@enums/filters';
import { LanguageKeys } from '@enums/languageKeys';
import type { FC } from 'react';
import type { MultiLanguageString } from '@interfaces/IProduct';

interface IChangeFilterProps {
  filterName: filters.Category | filters.Manufacturer | "industries",
  filterValue: { _id: string, name: string | MultiLanguageString}
}

const ChangeFilter:FC<IChangeFilterProps> = ({ filterValue, filterName }) => {
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
        onSubmit={async (values) => {
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
            console.log(values)
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form>
          {(filterName === filters.Category || filterName === 'industries') && (
            <label className="mb-[22px] flex flex-col gap-[12px]">
              {Object.values(LanguageKeys).map(lang => (
                <div key={lang} className="relative">
                  <label
                    className={'absolute left-[20px] top-1/2 -translate-y-1/2'}
                  >
                    <span className={'font-openSans text-[14px] text-desc'}>
                      {lang.toUpperCase()}
                    </span>
                    &nbsp;&nbsp;|
                  </label>
                  <Field
                    className={
                      'w-full rounded-[22px] border border-neutral py-[14px] pl-[65px] pr-[56px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent md:h-full'
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
                'mb-[22px] w-full rounded-[22px] border border-neutral py-[14px] pl-[22px] pr-[56px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent md:h-full'
              }
              placeholder={'Enter manufacturer'}
              name={'name'}
            />
          )}
          <button
            className="w-full rounded-[32px] bg-accent py-[12px]"
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
