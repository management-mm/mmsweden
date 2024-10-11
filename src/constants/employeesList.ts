import { Employee } from '@enums/i18nConstants';

export interface IEmployeeItem {
  title: string;
  desc: string;
  phone: string;
  phoneHref: string;
  additionalInfo?: string;
  email: string;
}

const employeesList: IEmployeeItem[] = [
  {
    title: Employee.Hampus,
    desc: Employee.HampusDesc,
    phone: '+46 733 38 78 37',
    phoneHref: '+46733387837',
    email: 'hampus@mmsweden.se',
  },
  {
    title: Employee.Hakan,
    desc: Employee.HakanDesc,
    phone: '+46 708 47 86 47',
    phoneHref: '+46708478647',
    email: 'hakan@mmsweden.se',
  },
  {
    title: Employee.Erika,
    desc: Employee.ErikaDesc,
    phone: '+46 707 97 68 38',
    phoneHref: '+46707976838',
    email: 'erika@mmsweden.se',
  },
  {
    title: Employee.Eva,
    desc: Employee.EvaDesc,
    phone: '+46 411 199 00',
    phoneHref: '+4641119900',
    email: 'eva@mmsweden.se',
  },
  {
    title: Employee.Catharine,
    desc: Employee.CatharineDesc,
    phone: '+46 411 199 00',
    phoneHref: '+4641119900',
    email: 'catharine@mmsweden.se',
  },
  {
    title: Employee.Artem,
    desc: Employee.ArtemDesc,
    phone: '+46 73-508 63 72',
    phoneHref: '+46735086372',
    additionalInfo: '(Call/WhatsApp)',
    email: 'artem@mmsweden.se',
  },
];

export default employeesList;
