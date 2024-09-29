import { Description } from '@enums/i18nConstants';

export interface IFactsAndFiguresItem {
  title: string;
  desc: string;
}

const factsAndFiguresList: IFactsAndFiguresItem[] = [
  {
    title: '20+',
    desc: Description.YearsMarket,
  },
  {
    title: '2450+',
    desc: Description.ProductsCatalogue,
  },
  {
    title: '2200+',
    desc: Description.SuccessfulDeals,
  },
];

export default factsAndFiguresList;
