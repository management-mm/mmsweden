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
    title: 'Hampus Wahlgren',
    desc: 'SALES Sweden & Abroad',
    phone: '+46 733 38 78 37',
    phoneHref: '+46733387837',
    email: 'hampus@mmsweden.se',
  },
  {
    title: 'Håkan Wahlgren',
    desc: 'CEO & PURCHASER',
    phone: '+46 708 47 86 47',
    phoneHref: '+46708478647',
    email: 'hakan@mmsweden.se',
  },
  {
    title: 'Erika Walgreen',
    desc: 'ADMIN. MANAGER & REAL ESTATE',
    phone: '+46 707 97 68 38',
    phoneHref: '+46707976838',
    email: 'erika@mmsweden.se',
  },
  {
    title: 'Eva Andersson',
    desc: 'ECONOMY',
    phone: '+46 411 199 00',
    phoneHref: '+4641119900',
    email: 'eva@mmsweden.se',
  },
  {
    title: 'Catharine Wahlgren',
    desc: 'ECONOMY',
    phone: '+46 411 199 00',
    phoneHref: '+4641119900',
    email: 'catharine@mmsweden.se',
  },
  {
    title: 'Artem Bortnik',
    desc: 'SALES ASSISTANT',
    phone: '+46 73-508 63 72',
    phoneHref: '+46735086372',
    additionalInfo: '(Call/WhatsApp)',
    email: 'artem@mmsweden.se',
  },
];

export default employeesList;
