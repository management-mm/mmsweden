import { SellToUs } from '@enums/i18nConstants';
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
    title: SellToUs.FairTitle,
    desc: SellToUs.FairDesc,
    className: 'mb-[30px]',
  },
  {
    iconId: 'ClockStrokes',
    iconSize: { width: 40, height: 34 },
    iconClassName: 'w-[50px] h-[44px] lg:w-[40px] lg:h-[34px]',
    title: SellToUs.QuickTitle,
    desc: SellToUs.QuickDesc,
    className: 'mb-[30px]',
  },
  {
    iconId: 'Recycling',
    iconSize: { width: 34, height: 34 },
    iconClassName: 'w-[44px] h-[44px] lg:w-[34px] lg:h-[34px]',
    title: SellToUs.SustainableTitle,
    desc: SellToUs.SustainableDesc,
  },
];

export default sellToUsList;
