import { useCallback, useEffect, useState } from 'react';

import type { IProduct } from 'interfaces/IProduct';

import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

import { toggleRequestedProducts } from '@store/requestedProducts/requestedProductsSlice';
import { selectRequestedProducts } from '@store/selectors';

const useUpdateRequestedProducts = (product: IProduct) => {
  const dispatch = useAppDispatch();
  const requestedProducts = useAppSelector(selectRequestedProducts);

  const checkIfProductRequested = useCallback(
    () => requestedProducts.some(requested => requested._id === product._id),
    [requestedProducts, product]
  );

  const [isRequested, setIsRequested] = useState<boolean>(() =>
    checkIfProductRequested()
  );

  useEffect(() => {
    setIsRequested(checkIfProductRequested());
  }, [checkIfProductRequested]);

  const handleToggleFavorites = (product: IProduct) => {
    dispatch(toggleRequestedProducts(product));
    setIsRequested(checkIfProductRequested());
  };

  return { isRequested, handleToggleFavorites };
};

export default useUpdateRequestedProducts;
