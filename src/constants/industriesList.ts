import { Industry } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

export interface IIndustryItem {
  iconId: keyof typeof IconId;
  iconSize: { width: number; height: number };
  title: string;
  desc: string;
  className?: string;
}

const industriesList: IIndustryItem[] = [
  {
    iconId: 'Meat',
    iconSize: { width: 91, height: 60 },
    title: Industry.MeatTitle,
    desc: Industry.MeatDesc,
    className: 'mb-[32px] md:mb-0',
  },
  {
    iconId: 'Fish',
    iconSize: { width: 54, height: 70 },
    title: Industry.FishTitle,
    desc: Industry.FishDesc,
    className: 'mb-[32px] md:mb-0',
  },
  {
    iconId: 'Cake',
    iconSize: { width: 77, height: 65 },
    title: Industry.BakeryTitle,
    desc: Industry.BakeryDesc,
    className: 'mb-[32px] md:mb-0',
  },
  {
    iconId: 'IceCream',
    iconSize: { width: 44, height: 73 },
    title: Industry.DairyTitle,
    desc: Industry.DairyDesc,
    className: 'mb-[32px] md:mb-0',
  },
  {
    iconId: 'Cabbage',
    iconSize: { width: 58, height: 58 },
    title: Industry.VegetablesTitle,
    desc: Industry.VegetablesDesc,
    className: 'mb-[32px] md:mb-0',
  },
  {
    iconId: 'Medicine',
    iconSize: { width: 47, height: 64 },
    title: Industry.MedicinesTitle,
    desc: Industry.MedicinesDesc,
  },
];

export default industriesList;
