import { WhyChooseUs } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

export interface IWhyChooseUsItem {
  iconId: keyof typeof IconId;
  iconSize: { width: number; height: number };
  iconClassName?: string;
  title: string;
  desc: string;
  className?: string;
}

const whyChooseUsList: IWhyChooseUsItem[] = [
  {
    iconId: 'Calendar',
    iconSize: { width: 34, height: 38 },
    iconClassName: '',
    title: '20+',
    desc: WhyChooseUs.YearsDesc,
    className: 'mb-[30px]',
  },
  {
    iconId: 'Medal',
    iconSize: { width: 28, height: 38 },
    iconClassName: 'fill-[#EAF1F8]',
    title: WhyChooseUs.TheBestTitle,
    desc: WhyChooseUs.TheBestDesc,
    className: 'mb-[30px]',
  },
  {
    iconId: 'Reviews',
    iconSize: { width: 38, height: 38 },
    iconClassName: 'fill-[#EAF1F8]',
    title: WhyChooseUs.ThousandsTitle,
    desc: WhyChooseUs.ThousandsDesc,
  },
];

export default whyChooseUsList;
