'use client';

import { type ChangeEvent, useState } from 'react';

import { Field, useFormikContext } from 'formik';

const Condition = ({ initialValue = 'used' }) => {
  const [checkedValue, setCheckedValue] = useState(initialValue);
  const { setFieldValue } = useFormikContext();

  const handleCheckedValue = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckedValue(event.target.value);
    setFieldValue('condition', event.target.value, false);
  };
  return (
    <div className="flex gap-[20px]">
      <label className="w-[calc((100%-20px)/2)] cursor-pointer text-center transition-colors">
        <Field
          className="peer hidden"
          type="radio"
          name="condition"
          value="new"
          checked={checkedValue === 'new'}
          onChange={handleCheckedValue}
        />
        <span className="border-primary peer-checked:bg-secondary-accent block rounded-[32px] border py-[10px] peer-checked:text-white">
          New
        </span>
      </label>
      <label className="w-[calc((100%-20px)/2)] cursor-pointer text-center transition-colors">
        <Field
          className="peer hidden"
          type="radio"
          name="condition"
          value="used"
          checked={checkedValue === 'used'}
          onChange={handleCheckedValue}
        />
        <span className="border-primary peer-checked:bg-secondary-accent block rounded-[32px] border py-[10px] peer-checked:text-white">
          Used
        </span>
      </label>
    </div>
  );
};

export default Condition;
