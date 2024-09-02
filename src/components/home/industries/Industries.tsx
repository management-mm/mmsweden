import { NavLink } from 'react-router-dom';

import IndustryItem from './IndustryItem';

import Button from '@components/common/Button';

import industriesList from '@constants/industriesList';

const Industries = () => {
  return (
    <section className="pb-[96px] text-center">
      <div className="container">
        <h2 className="mb-[6px] text-[32px] font-bold leading-tight text-title md:text-[48px]">
          Industries
        </h2>
        <p className="mb-[48px] text-[16px] font-medium leading-normal text-desc">
          Our products are used in such industries:
        </p>
        <ul className="mb-[32px] text-center md:flex md:flex-wrap md:gap-[30px]">
          {industriesList.map(industry => {
            const { iconId, iconSize, title, desc, className } = industry;
            return (
              <IndustryItem
                key={title}
                iconId={iconId}
                iconSize={iconSize}
                title={title}
                desc={desc}
                className={className}
              />
            );
          })}
        </ul>
        <Button intent="accent">
          <NavLink
            to="all-products"
            className="text-[16px] font-semibold leading-tight text-primary"
          >
            Shop now
          </NavLink>
        </Button>
      </div>
    </section>
  );
};

export default Industries;
