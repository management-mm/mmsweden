import { AboutUs } from '@enums/i18nConstants';

export interface IAboutUsItem {
  title: string;
  desc: string;
}

const aboutUsList: IAboutUsItem[] = [
  {
    title: AboutUs.WhoWeAreTitle,
    desc: AboutUs.WhoWeAreDesc,
  },
  {
    title: AboutUs.WhatWeDoTitle,
    desc: AboutUs.WhatWeDoDesc,
  },
  {
    title: AboutUs.OurCommitmentTitle,
    desc: AboutUs.OurCommitmentDesc,
  },
  {
    title: AboutUs.OurCustomersTitle,
    desc: AboutUs.OurCustomersDesc,
  },
  {
    title: AboutUs.ContinuousTitle,
    desc: AboutUs.ContinuousDesc,
  },
];

export default aboutUsList;
