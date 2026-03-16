'use client';

import { createContext, useContext } from 'react';

export const ProductsTotalContext = createContext<number | null>(null);

export const useProductsTotal = () => {
  const ctx = useContext(ProductsTotalContext);

  if (ctx === null) {
    throw new Error(
      'useProductsTotal must be used inside ProductsTotalProvider'
    );
  }

  return ctx;
};
