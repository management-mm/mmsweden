import { FaLock } from 'react-icons/fa';

import { Field, FormikValues, useFormikContext } from 'formik';

import Desc from '../common/Desc';

export default function Notes() {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  const handleChangeNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFieldValue('notes', e.target.value);
  };

  return (
    <div className="border-primary rounded-[22px] border p-[20px]">
      <label htmlFor="notes" className="block">
        <div className="mb-[8px] flex items-center gap-[8px]">
          <FaLock size={18} className="fill-primary" />
          <span className="font-openSans text-primary text-[14px] font-semibold">
            Personal notes (internal)
          </span>
        </div>

        <Desc text="These notes are only visible to administrators and will not be shown on the website." />
      </label>

      <Field
        id="notes"
        as="textarea"
        name="notes"
        placeholder="Write your notes here..."
        value={values.notes || ''}
        onChange={handleChangeNotes}
        className="border-neutral transition-border duration-primary focus:border-secondary-accent mt-[12px] min-h-[120px] w-full resize-y rounded-[22px] border px-[22px] py-[14px] text-[14px] outline-none"
      />
    </div>
  );
}
