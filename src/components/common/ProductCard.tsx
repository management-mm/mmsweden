import { NavLink } from 'react-router-dom';

import Button from './Button';

const ProductCard = () => {
  return (
    <article className="h-[504px] w-[296px] rounded-[4px] border border-secondary md:w-[264px]">
      <div className="relative">
        <img />
        <span className="absolute left-[8px] top-[8px] inline-block px-[6px] py-[3px] text-[12px] font-medium uppercase leading-tight"></span>
      </div>
      <h3 className="mb-[4px] text-[16px] font-semibold text-secondaryTitle"></h3>
      <p className="mb-[12px] font-openSans text-[12px] text-desc"></p>
      <p className="mb-[22px] font-openSans text-[12px] text-title"></p>
      <p></p>
      <div className="flex justify-between">
        <Button
          intent="primary"
          className="px-[15px] py-[10px] text-[12px] font-semibold md:py-[10px]"
        >
          <NavLink to="all-products/:productId">View Details</NavLink>
        </Button>
        <Button
          intent="accent"
          className="px-[15px] py-[10px] text-[12px] font-semibold shadow-none md:py-[10px]"
        >
          Request Pricing
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
