import type { Dispatch, FC, SetStateAction } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import { useFormikContext } from 'formik';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

interface ICheckedCatManIndItemProps {
  checkedValue: MultiLanguageString | string;
  checkedValuesArray?: (string | MultiLanguageString)[] | string;
  setCheckedValue: Dispatch<
    SetStateAction<
      MultiLanguageString | string | (MultiLanguageString | string)[]
    >
  >;
}

const CheckedCatManIndItem: FC<ICheckedCatManIndItemProps> = ({
  checkedValue,
  checkedValuesArray,
  setCheckedValue,
}) => {
  const { setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      // key={}
      onClick={e => {
        if (Array.isArray(checkedValuesArray)) {
          const withoutDeletedCheckedValue = checkedValuesArray.filter(
            value => value !== e.currentTarget.textContent
          );
          setCheckedValue(withoutDeletedCheckedValue);
          setFieldValue('industries', withoutDeletedCheckedValue, false);
          return;
        }
        setCheckedValue(['']);
      }}
      className="flex items-center gap-[8px] rounded-[32px] border border-primary bg-secondary px-[8px] py-[7px] text-[12px] text-primary"
    >
      {typeof checkedValue === 'object' ? checkedValue.en : checkedValue}
      <div className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-primary">
        <SvgIcon
          className="fill-[rgb(234,241,248)]"
          iconId={IconId.Reset}
          size={{ width: 6, height: 6 }}
        />
      </div>
    </button>
  );
};

export default CheckedCatManIndItem;
