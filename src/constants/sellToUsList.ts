import { IconId } from '@enums/iconsSpriteId';

export interface ISellToUsItem {
  iconId: keyof typeof IconId;
  iconSize: { width: number; height: number };
  iconClassName?: string;
  title: string;
  desc: string;
  className?: string;
}

const sellToUsList: ISellToUsItem[] = [
  {
    iconId: 'Handshake',
    iconSize: { width: 54, height: 43 },
    iconClassName: 'w-[64px] h-[53px] lg:w-[54px] lg:h-[43px]',
    title: 'Fair and Competitive Offers',
    desc: 'We provide fair and competitive offers for your idle equipment, ensuring you get the best value for machinery that is no longer in use.',
    className: 'mb-[30px]',
  },
  {
    iconId: 'ClockStrokes',
    iconSize: { width: 40, height: 34 },
    iconClassName: 'w-[50px] h-[44px] lg:w-[40px] lg:h-[34px]',
    title: 'Quick and Hassle-Free Transactions',
    desc: 'Benefit from the easiest and fastest method for selling equipment, with an advance payment and delivery included. Transactions are quick and hassle-free, saving valuable time and effort.',
    className: 'mb-[30px]',
  },
  {
    iconId: 'Recycling',
    iconSize: { width: 34, height: 34 },
    iconClassName: 'w-[44px] h-[44px] lg:w-[34px] lg:h-[34px]',
    title: 'Sustainable and Responsible Recycling',
    desc: 'Contribute to a more sustainable and responsible recycling process by giving machinery a second life and reducing waste',
  },
];

export default sellToUsList;
