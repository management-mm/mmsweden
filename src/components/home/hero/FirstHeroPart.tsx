import { NavLink } from 'react-router-dom';

import Button from '@components/common/Button';
import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';

const FirstHeroPart = () => {
  return (
    <div className="bg-primary pb-[51px] pt-[184px]">
      <div className="container">
        <div className="mb-[164px]">
          <h1 className="mb-[6px] text-[64px] font-bold leading-tight text-secondary md:text-[84px]">
            Machines Sweden
          </h1>
          <p className="mb-[44px] text-[16px] font-medium leading-normal text-secondary">
            Used machines - New products
          </p>
          <div className="gap-[30px] md:flex">
            <Button intent="accent" className="mb-[22px] shadow-none md:mb-0">
              <NavLink to="all-products">New Arrivals</NavLink>
            </Button>

            <Button intent={'allMachines'}>
              <NavLink to="all-products"> All machines</NavLink>
            </Button>
          </div>
        </div>
        <a
          className="flex w-[226px] items-center"
          href="https://www.youtube.com/@meatmachinesswedenab6915"
        >
          <div className="bg-[rgba(252, 252, 252, 0.12)] flex h-[44px] w-[44px] items-center justify-center rounded-full border border-secondary">
            <SvgIcon
              className="fill-secondary"
              iconId={IconId.Youtube}
              size={{ width: 20, height: 14 }}
            />
          </div>
          <p className="text-[14px] font-semibold leading-tight text-secondary">
            Watch On YouTube
          </p>
          <SvgIcon
            className="fill-secondary"
            iconId={IconId.ArrowRight}
            size={{ width: 8, height: 14 }}
          />
        </a>
      </div>
    </div>
  );
};

export default FirstHeroPart;
