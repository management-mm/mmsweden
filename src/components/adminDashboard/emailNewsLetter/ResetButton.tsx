import { useContext } from 'react';

import {
  SelectedItemsContext,
  SlotItemMapContext,
} from './EmailNewsLetterMain';

import { clearAll } from '@store/selectedProductsSlice';

import { useAppDispatch } from '@hooks/useAppDispatch';

import initSlotItemMap from '@utils/initSlotItemMap';

const ResetButton = () => {
  const dispatch = useAppDispatch();
  const { setItems } = useContext(SelectedItemsContext);
  const { setSlotItemMap } = useContext(SlotItemMapContext);
  const handleReset = () => {
    dispatch(clearAll());

    setItems([]);
    setSlotItemMap(initSlotItemMap([], 'id'));
  };
  return <button onClick={handleReset}>Reset</button>;
};

export default ResetButton;
