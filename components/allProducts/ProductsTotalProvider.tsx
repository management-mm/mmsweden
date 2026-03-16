'use client';

import { ProductsTotalContext } from './ProductsTotalContext';

type Props = {
  total: number;
  children: React.ReactNode;
};

const ProductsTotalProvider = ({ total, children }: Props) => {
  return (
    <ProductsTotalContext.Provider value={total}>
      {children}
    </ProductsTotalContext.Provider>
  );
};

export default ProductsTotalProvider;
