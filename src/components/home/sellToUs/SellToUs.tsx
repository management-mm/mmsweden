import { NavLink } from 'react-router-dom';

import SellToUsItem from './SellToUsItem';

import Button from '@components/common/Button';

import { cn } from '@utils/cn';

import sellToUsList from '@constants/sellToUsList';

const SellToUs = () => {
  return (
    <section className="bg-primary py-[80px] text-center lg:text-start">
      <div
        className={cn(
          'container',
          'text-secondary md:items-center lg:flex lg:gap-[33px]'
        )}
      >
        <div className="lg:w-[457px]">
          <h2 className="mb-[22px] text-[48px] font-bold leading-tight">
            Sell to Us
          </h2>
          <p className="mb-[32px] text-[16px] font-medium leading-normal">
            Stop storing thousands of dollars in your warehouses when the price
            of your idle equipment decreases every year. <br />
            So what are you waiting for?
          </p>
          <Button intent="accent" className="hidden shadow-none lg:block">
            <NavLink to="sell-to-us">Sell to Us</NavLink>
          </Button>
        </div>
        <ul className="mb-[22px] md:mx-auto md:w-[calc(100%-200px)] lg:mx-0 lg:mb-0 lg:w-[656px]">
          {sellToUsList.map(sellToUsItem => {
            const { iconId, iconSize, iconClassName, title, desc, className } =
              sellToUsItem;
            return (
              <SellToUsItem
                key={title}
                iconId={iconId}
                iconClassName={iconClassName}
                iconSize={iconSize}
                title={title}
                desc={desc}
                className={className}
              />
            );
          })}
        </ul>
        <Button intent="accent" className="shadow-none md:mx-auto lg:hidden">
          <NavLink to="sell-to-us">Sell to Us</NavLink>
        </Button>
      </div>
    </section>
  );
};

export default SellToUs;
