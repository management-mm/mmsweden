import Skeleton from 'react-loading-skeleton';

import getProductName from '@utils/getProductName';

const ProductDetails = ({
  isLoading,
  name,
  language,
  idNumber,
  description,
  dimensions,
}) => {
  return (
    <>
      <h3 className="mb-[4px] text-[16px] font-semibold uppercase text-primary">
        {!isLoading ? getProductName(name, language) : <Skeleton width={150} />}
      </h3>
      <p className="mb-[4px] text-[14px] font-semibold text-secondaryAccent">
        {!isLoading ? 'ID NR' : <Skeleton width={80} />}

        <span>{!isLoading ? idNumber : <Skeleton width={80} />}</span>
      </p>
      <p className="mb-[12px] font-openSans text-[12px] text-desc">
        {!isLoading ? dimensions : <Skeleton width={120} />}
      </p>
      <p className="mb-auto line-clamp-6 w-full font-openSans text-[12px] text-title">
        {!isLoading ? description?.[language] : <Skeleton count={3} />}
      </p>
    </>
  );
};

export default ProductDetails;
