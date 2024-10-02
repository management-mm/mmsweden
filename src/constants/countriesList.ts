import type { MultiLanguageString } from '@interfaces/IProduct';

export interface ICountry {
  translations: MultiLanguageString;
  flag: string;
  callingCode: string;
  phoneFormat: string;
}

const countriesList: ICountry[] = [
  {
    translations: {
      en: 'Afghanistan',
      sv: 'Afghanistan',
      de: 'Afghanistan',
      fr: 'Afghanistan',
      es: 'Afganistán',
      ru: 'Афганистан',
      uk: 'Афганістан',
    },
    flag: 'https://flagcdn.com/w320/af.png',
    callingCode: '+93',
    phoneFormat: '99-999-9999',
  },
  {
    translations: {
      en: 'Albania',
      sv: 'Albanien',
      de: 'Albanien',
      fr: 'Albanie',
      es: 'Albania',
      ru: 'Албания',
      uk: 'Албанія',
    },
    flag: 'https://flagcdn.com/w320/al.png',
    callingCode: '+355',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Algeria',
      sv: 'Algeriet',
      de: 'Algerien',
      fr: 'Algérie',
      es: 'Argelia',
      ru: 'Алжир',
      uk: 'Алжир',
    },
    flag: 'https://flagcdn.com/w320/dz.png',
    callingCode: '+213',
    phoneFormat: '00 0000 0000',
  },
  {
    translations: {
      en: 'Angola',
      sv: 'Angola',
      de: 'Angola',
      fr: 'Angola',
      es: 'Angola',
      ru: 'Ангола',
      uk: 'Ангола',
    },
    flag: 'https://flagcdn.com/w320/ao.png',
    callingCode: '+244',
    phoneFormat: '+244(999)999-999',
  },
  {
    translations: {
      en: 'Argentina',
      sv: 'Argentina',
      de: 'Argentinien',
      fr: 'Argentine',
      es: 'Argentina',
      ru: 'Аргентина',
      uk: 'Аргентина',
    },
    flag: 'https://flagcdn.com/w320/ar.png',
    callingCode: '+54',
    phoneFormat: '00 0000-0000',
  },
  {
    translations: {
      en: 'Armenia',
      sv: 'Armenien',
      de: 'Armenien',
      fr: 'Arménie',
      es: 'Armenia',
      ru: 'Армения',
      uk: 'Вірменія',
    },
    flag: 'https://flagcdn.com/w320/am.png',
    callingCode: '+374',
    phoneFormat: '00 00 00 00',
  },
  {
    translations: {
      en: 'Australia',
      sv: 'Australien',
      de: 'Australien',
      fr: 'Australie',
      es: 'Australia',
      ru: 'Австралия',
      uk: 'Австралія',
    },
    flag: 'https://flagcdn.com/w320/au.png',
    callingCode: '+61',
    phoneFormat: '9-9999-9999',
  },
  {
    translations: {
      en: 'Austria',
      sv: 'Österrike',
      de: 'Österreich',
      fr: 'Autriche',
      es: 'Austria',
      ru: 'Австрия',
      uk: 'Австрія',
    },
    flag: 'https://flagcdn.com/w320/at.png',
    callingCode: '+43',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Azerbaijan',
      sv: 'Azerbajdzjan',
      de: 'Aserbaidschan',
      fr: 'Azerbaïdjan',
      es: 'Azerbaiyán',
      ru: 'Азербайджан',
      uk: 'Азербайджан',
    },
    flag: 'https://flagcdn.com/w320/az.png',
    callingCode: '+994',
    phoneFormat: '99-999-99-99',
  },
  {
    translations: {
      en: 'Bangladesh',
      sv: 'Bangladesh',
      de: 'Bangladesch',
      fr: 'Bangladesh',
      es: 'Bangladés',
      ru: 'Бангладеш',
      uk: 'Бангладеш',
    },
    flag: 'https://flagcdn.com/w320/bd.png',
    callingCode: '+880',
    phoneFormat: '99-999-999',
  },
  {
    translations: {
      en: 'Belgium',
      sv: 'Belgien',
      de: 'Belgien',
      fr: 'Belgique',
      es: 'Bélgica',
      ru: 'Бельгия',
      uk: 'Бельгія',
    },
    flag: 'https://flagcdn.com/w320/be.png',
    callingCode: '+32',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Bolivia',
      sv: 'Bolivia',
      de: 'Bolivien',
      fr: 'Bolivie',
      es: 'Bolivia',
      ru: 'Боливия',
      uk: 'Болівія',
    },
    flag: 'https://flagcdn.com/w320/bo.png',
    callingCode: '+591',
    phoneFormat: '9-999-9999',
  },
  {
    translations: {
      en: 'Bosnia and Herzegovina',
      sv: 'Bosnien och Hercegovina',
      de: 'Bosnien und Herzegowina',
      fr: 'Bosnie-Herzégovine',
      es: 'Bosnia y Herzegovina',
      ru: 'Босния и Герцеговина',
      uk: 'Боснія і Герцеговина',
    },
    flag: 'https://flagcdn.com/w320/ba.png',
    callingCode: '+387',
    phoneFormat: '00 000 000',
  },
  {
    translations: {
      en: 'Brazil',
      sv: 'Brasilien',
      de: 'Brasilien',
      fr: 'Brésil',
      es: 'Brasil',
      ru: 'Бразилия',
      uk: 'Бразилія',
    },
    flag: 'https://flagcdn.com/w320/br.png',
    callingCode: '+55',
    phoneFormat: '00 0000-0000',
  },
  {
    translations: {
      en: 'Bulgaria',
      sv: 'Bulgarien',
      de: 'Bulgarien',
      fr: 'Bulgarie',
      es: 'Bulgaria',
      ru: 'Болгария',
      uk: 'Болгарія',
    },
    flag: 'https://flagcdn.com/w320/bg.png',
    callingCode: '+359',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Cambodia',
      sv: 'Kambodja',
      de: 'Kambodscha',
      fr: 'Cambodge',
      es: 'Camboya',
      ru: 'Камбоджа',
      uk: 'Камбоджа',
    },
    flag: 'https://flagcdn.com/w320/kh.png',
    callingCode: '+855',
    phoneFormat: '00 000 000',
  },
  {
    translations: {
      en: 'Canada',
      sv: 'Kanada',
      de: 'Kanada',
      fr: 'Canada',
      es: 'Canadá',
      ru: 'Канада',
      uk: 'Канада',
    },
    flag: 'https://flagcdn.com/w320/ca.png',
    callingCode: '+1',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Chile',
      sv: 'Chile',
      de: 'Chile',
      fr: 'Chili',
      es: 'Chile',
      ru: 'Чили',
      uk: 'Чилі',
    },
    flag: 'https://flagcdn.com/w320/cl.png',
    callingCode: '+56',
    phoneFormat: '9-9999-9999',
  },
  {
    translations: {
      en: 'China',
      sv: 'Kina',
      de: 'China',
      fr: 'Chine',
      es: 'China',
      ru: 'Китай',
      uk: 'Китай',
    },
    flag: 'https://flagcdn.com/w320/cn.png',
    callingCode: '+86',
    phoneFormat: '000 0000 0000',
  },
  {
    translations: {
      en: 'Colombia',
      sv: 'Colombia',
      de: 'Kolumbien',
      fr: 'Colombie',
      es: 'Colombia',
      ru: 'Колумбия',
      uk: 'Колумбія',
    },
    flag: 'https://flagcdn.com/w320/co.png',
    callingCode: '+57',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Czech Republic',
      sv: 'Tjeckien',
      de: 'Tschechische Republik',
      fr: 'République tchèque',
      es: 'República Checa',
      ru: 'Чехия',
      uk: 'Чехія',
    },
    flag: 'https://flagcdn.com/w320/cz.png',
    callingCode: '+420',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Denmark',
      sv: 'Danmark',
      de: 'Dänemark',
      fr: 'Danemark',
      es: 'Dinamarca',
      ru: 'Дания',
      uk: 'Данія',
    },
    flag: 'https://flagcdn.com/w320/dk.png',
    callingCode: '+45',
    phoneFormat: '99-99-99-99',
  },
  {
    translations: {
      en: 'Egypt',
      sv: 'Egypten',
      de: 'Ägypten',
      fr: 'Égypte',
      es: 'Egipto',
      ru: 'Египет',
      uk: 'Єгипет',
    },
    flag: 'https://flagcdn.com/w320/eg.png',
    callingCode: '+20',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Estonia',
      sv: 'Estland',
      de: 'Estland',
      fr: 'Estonie',
      es: 'Estonia',
      ru: 'Эстония',
      uk: 'Естонія',
    },
    flag: 'https://flagcdn.com/w320/ee.png',
    callingCode: '+372',
    phoneFormat: '000 0000',
  },
  {
    translations: {
      en: 'Finland',
      sv: 'Finland',
      de: 'Finnland',
      fr: 'Finlande',
      es: 'Finlandia',
      ru: 'Финляндия',
      uk: 'Фінляндія',
    },
    flag: 'https://flagcdn.com/w320/fi.png',
    callingCode: '+358',
    phoneFormat: '(999)999-99-99',
  },
  {
    translations: {
      en: 'France',
      sv: 'Frankrike',
      de: 'Frankreich',
      fr: 'France',
      es: 'Francia',
      ru: 'Франция',
      uk: 'Франція',
    },
    flag: 'https://flagcdn.com/w320/fr.png',
    callingCode: '+33',
    phoneFormat: '00 00 00 00 00',
  },
  {
    translations: {
      en: 'Georgia',
      sv: 'Georgien',
      de: 'Georgien',
      fr: 'Géorgie',
      es: 'Georgia',
      ru: 'Грузия',
      uk: 'Грузія',
    },
    flag: 'https://flagcdn.com/w320/ge.png',
    callingCode: '+995',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Germany',
      sv: 'Tyskland',
      de: 'Deutschland',
      fr: 'Allemagne',
      es: 'Alemania',
      ru: 'Германия',
      uk: 'Німеччина',
    },
    flag: 'https://flagcdn.com/w320/de.png',
    callingCode: '+49',
    phoneFormat: '000 000000',
  },
  {
    translations: {
      en: 'Ghana',
      sv: 'Ghana',
      de: 'Ghana',
      fr: 'Ghana',
      es: 'Ghana',
      ru: 'Гана',
      uk: 'Гана',
    },
    flag: 'https://flagcdn.com/w320/gh.png',
    callingCode: '+233',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Greece',
      sv: 'Grekland',
      de: 'Griechenland',
      fr: 'Grèce',
      es: 'Grecia',
      ru: 'Греция',
      uk: 'Греція',
    },
    flag: 'https://flagcdn.com/w320/gr.png',
    callingCode: '+30',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Hungary',
      sv: 'Ungern',
      de: 'Ungarn',
      fr: 'Hongrie',
      es: 'Hungría',
      ru: 'Венгрия',
      uk: 'Угорщина',
    },
    flag: 'https://flagcdn.com/w320/hu.png',
    callingCode: '+36',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Iceland',
      sv: 'Island',
      de: 'Island',
      fr: 'Islande',
      es: 'Islandia',
      ru: 'Исландия',
      uk: 'Ісландія',
    },
    flag: 'https://flagcdn.com/w320/is.png',
    callingCode: '+354',
    phoneFormat: '999-9999',
  },
  {
    translations: {
      en: 'India',
      sv: 'Indien',
      de: 'Indien',
      fr: 'Inde',
      es: 'India',
      ru: 'Индия',
      uk: 'Індія',
    },
    flag: 'https://flagcdn.com/w320/in.png',
    callingCode: '+91',
    phoneFormat: '(9999)999-999',
  },
  {
    translations: {
      en: 'Indonesia',
      sv: 'Indonesien',
      de: 'Indonesien',
      fr: 'Indonésie',
      es: 'Indonesia',
      ru: 'Индонезия',
      uk: 'Індонезія',
    },
    flag: 'https://flagcdn.com/w320/id.png',
    callingCode: '+62',
    phoneFormat: '00 0000 0000',
  },
  {
    translations: {
      en: 'Iran',
      sv: 'Iran',
      de: 'Iran',
      fr: 'Iran',
      es: 'Irán',
      ru: 'Иран',
      uk: 'Іран',
    },
    flag: 'https://flagcdn.com/w320/ir.png',
    callingCode: '+98',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Iraq',
      sv: 'Irak',
      de: 'Irak',
      fr: 'Irak',
      es: 'Irak',
      ru: 'Ирак',
      uk: 'Ірак',
    },
    flag: 'https://flagcdn.com/w320/iq.png',
    callingCode: '+964',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Ireland',
      sv: 'Irland',
      de: 'Irland',
      fr: 'Irlande',
      es: 'Irlanda',
      ru: 'Ирландия',
      uk: 'Ірландія',
    },
    flag: 'https://flagcdn.com/w320/ie.png',
    callingCode: '+353',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Israel',
      sv: 'Israel',
      de: 'Israel',
      fr: 'Israël',
      es: 'Israel',
      ru: 'Израиль',
      uk: 'Ізраїль',
    },
    flag: 'https://flagcdn.com/w320/il.png',
    callingCode: '+972',
    phoneFormat: '00 000 0000',
  },
  {
    translations: {
      en: 'Italy',
      sv: 'Italien',
      de: 'Italien',
      fr: 'Italie',
      es: 'Italia',
      ru: 'Италия',
      uk: 'Італія',
    },
    flag: 'https://flagcdn.com/w320/it.png',
    callingCode: '+39',
    phoneFormat: '(999)9999-999',
  },
  {
    translations: {
      en: 'Japan',
      sv: 'Japan',
      de: 'Japan',
      fr: 'Japon',
      es: 'Japón',
      ru: 'Япония',
      uk: 'Японія',
    },
    flag: 'https://flagcdn.com/w320/jp.png',
    callingCode: '+81',
    phoneFormat: '00-0000-0000',
  },
  {
    translations: {
      en: 'Kazakhstan',
      sv: 'Kazakstan',
      de: 'Kasachstan',
      fr: 'Kazakhstan',
      es: 'Kazajistán',
      ru: 'Казахстан',
      uk: 'Казахстан',
    },
    flag: 'https://flagcdn.com/w320/kz.png',
    callingCode: '+7',
    phoneFormat: '00 000 00 00',
  },
  {
    translations: {
      en: 'Kenya',
      sv: 'Kenya',
      de: 'Kenia',
      fr: 'Kenya',
      es: 'Kenia',
      ru: 'Кения',
      uk: 'Кенія',
    },
    flag: 'https://flagcdn.com/w320/ke.png',
    callingCode: '+254',
    phoneFormat: '999-999999',
  },
  {
    translations: {
      en: 'Kuwait',
      sv: 'Kuwait',
      de: 'Kuwait',
      fr: 'Kuwait',
      es: 'Kuwait',
      ru: 'Кувейт',
      uk: 'Кувейт',
    },
    flag: 'https://flagcdn.com/w320/kw.png',
    callingCode: '+965',
    phoneFormat: '9999-9999',
  },
  {
    translations: {
      en: 'Latvia',
      sv: 'Lettland',
      de: 'Lettland',
      fr: 'Lettonie',
      es: 'Letonia',
      ru: 'Латвия',
      uk: 'Латвія',
    },
    flag: 'https://flagcdn.com/w320/lv.png',
    callingCode: '+371',
    phoneFormat: '99-999-999',
  },
  {
    translations: {
      en: 'Lebanon',
      sv: 'Libanon',
      de: 'Libanon',
      fr: 'Liban',
      es: 'Líbano',
      ru: 'Ливан',
      uk: 'Ліван',
    },
    flag: 'https://flagcdn.com/w320/lb.png',
    callingCode: '+961',
    phoneFormat: '00 000 0000',
  },
  {
    translations: {
      en: 'Lithuania',
      sv: 'Litauen',
      de: 'Litauen',
      fr: 'Lituanie',
      es: 'Lituania',
      ru: 'Литва',
      uk: 'Литва',
    },
    flag: 'https://flagcdn.com/w320/lt.png',
    callingCode: '+370',
    phoneFormat: '(999)99-999',
  },
  {
    translations: {
      en: 'Luxembourg',
      sv: 'Luxemburg',
      de: 'Luxemburg',
      fr: 'Luxembourg',
      es: 'Luxemburgo',
      ru: 'Люксембург',
      uk: 'Люксембург',
    },
    flag: 'https://flagcdn.com/w320/lu.png',
    callingCode: '+352',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Malaysia',
      sv: 'Malaysien',
      de: 'Malaysia',
      fr: 'Malaisie',
      es: 'Malasia',
      ru: 'Малайзия',
      uk: 'Малайзія',
    },
    flag: 'https://flagcdn.com/w320/my.png',
    callingCode: '+60',
    phoneFormat: '000 000 0000',
  },
  {
    translations: {
      en: 'Mexico',
      sv: 'Mexiko',
      de: 'Mexiko',
      fr: 'Mexique',
      es: 'México',
      ru: 'Мексика',
      uk: 'Мексика',
    },
    flag: 'https://flagcdn.com/w320/mx.png',
    callingCode: '+52',
    phoneFormat: '00 0000-0000',
  },
  {
    translations: {
      en: 'Morocco',
      sv: 'Marocko',
      de: 'Marokko',
      fr: 'Maroc',
      es: 'Marruecos',
      ru: 'Марокко',
      uk: 'Марокко',
    },
    flag: 'https://flagcdn.com/w320/ma.png',
    callingCode: '+212',
    phoneFormat: '99-9999-999',
  },
  {
    translations: {
      en: 'Nepal',
      sv: 'Nepal',
      de: 'Nepal',
      fr: 'Népal',
      es: 'Nepal',
      ru: 'Непал',
      uk: 'Непал',
    },
    flag: 'https://flagcdn.com/w320/np.png',
    callingCode: '+977',
    phoneFormat: '99-999-999',
  },
  {
    translations: {
      en: 'Netherlands',
      sv: 'Nederländerna',
      de: 'Niederlande',
      fr: 'Pays-Bas',
      es: 'Países Bajos',
      ru: 'Нидерланды',
      uk: 'Нідерланди',
    },
    flag: 'https://flagcdn.com/w320/nl.png',
    callingCode: '+31',
    phoneFormat: '99-999-9999',
  },
  {
    translations: {
      en: 'New Zealand',
      sv: 'Nya Zeeland',
      de: 'Neuseeland',
      fr: 'Nouvelle-Zélande',
      es: 'Nueva Zelanda',
      ru: 'Новая Зеландия',
      uk: 'Нова Зеландія',
    },
    flag: 'https://flagcdn.com/w320/nz.png',
    callingCode: '+64',
    phoneFormat: '000 000 0000',
  },
  {
    translations: {
      en: 'Nigeria',
      sv: 'Nigeria',
      de: 'Nigeria',
      fr: 'Nigéria',
      es: 'Nigeria',
      ru: 'Нигерия',
      uk: 'Нігерія',
    },
    flag: 'https://flagcdn.com/w320/ng.png',
    callingCode: '+234',
    phoneFormat: '000 000 0000',
  },
  {
    translations: {
      en: 'Norway',
      sv: 'Norge',
      de: 'Norwegen',
      fr: 'Norvège',
      es: 'Noruega',
      ru: 'Норвегия',
      uk: 'Норвегія',
    },
    flag: 'https://flagcdn.com/w320/no.png',
    callingCode: '+47',
    phoneFormat: '(999)99-999',
  },
  {
    translations: {
      en: 'Pakistan',
      sv: 'Pakistan',
      de: 'Pakistan',
      fr: 'Pakistan',
      es: 'Pakistán',
      ru: 'Пакистан',
      uk: 'Пакистан',
    },
    flag: 'https://flagcdn.com/w320/pk.png',
    callingCode: '+92',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Peru',
      sv: 'Peru',
      de: 'Peru',
      fr: 'Pérou',
      es: 'Perú',
      ru: 'Перу',
      uk: 'Перу',
    },
    flag: 'https://flagcdn.com/w320/pe.png',
    callingCode: '+51',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Philippines',
      sv: 'Filippinerna',
      de: 'Philippinen',
      fr: 'Philippines',
      es: 'Filipinas',
      ru: 'Филиппины',
      uk: 'Філіппіни',
    },
    flag: 'https://flagcdn.com/w320/ph.png',
    callingCode: '+63',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Poland',
      sv: 'Polen',
      de: 'Polen',
      fr: 'Pologne',
      es: 'Polonia',
      ru: 'Польша',
      uk: 'Польща',
    },
    flag: 'https://flagcdn.com/w320/pl.png',
    callingCode: '+48',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Portugal',
      sv: 'Portugal',
      de: 'Portugal',
      fr: 'Portugal',
      es: 'Portugal',
      ru: 'Португалия',
      uk: 'Португалія',
    },
    flag: 'https://flagcdn.com/w320/pt.png',
    callingCode: '+351',
    phoneFormat: '99-999-9999',
  },
  {
    translations: {
      en: 'Romania',
      sv: 'Rumänien',
      de: 'Rumänien',
      fr: 'Roumanie',
      es: 'Rumania',
      ru: 'Румыния',
      uk: 'Румунія',
    },
    flag: 'https://flagcdn.com/w320/ro.png',
    callingCode: '+40',
    phoneFormat: '99-999-9999',
  },
  {
    translations: {
      en: 'Russia',
      sv: 'Ryssland',
      de: 'Russland',
      fr: 'Russie',
      es: 'Rusia',
      ru: 'Россия',
      uk: 'Росія',
    },
    flag: 'https://flagcdn.com/w320/ru.png',
    callingCode: '+7',
    phoneFormat: '(999)999-99-99',
  },
  {
    translations: {
      en: 'Saudi Arabia',
      sv: 'Saudiarabien',
      de: 'Saudi-Arabien',
      fr: 'Arabie Saoudite',
      es: 'Arabia Saudita',
      ru: 'Саудовская Аравия',
      uk: 'Саудівська Аравія',
    },
    flag: 'https://flagcdn.com/w320/sa.png',
    callingCode: '+966',
    phoneFormat: '00 000 0000',
  },
  {
    translations: {
      en: 'South Africa',
      sv: 'Sydafrika',
      de: 'Südafrika',
      fr: 'Afrique du Sud',
      es: 'Sudáfrica',
      ru: 'Южная Африка',
      uk: 'Південноафриканська Республіка',
    },
    flag: 'https://flagcdn.com/w320/za.png',
    callingCode: '+27',
    phoneFormat: '00 000 0000',
  },
  {
    translations: {
      en: 'South Korea',
      sv: 'Sydkorea',
      de: 'Südkorea',
      fr: 'Corée du Sud',
      es: 'Corea del Sur',
      ru: 'Южная Корея',
      uk: 'Південна Корея',
    },
    flag: 'https://flagcdn.com/w320/kr.png',
    callingCode: '+82',
    phoneFormat: '00-0000-0000',
  },
  {
    translations: {
      en: 'Spain',
      sv: 'Spanien',
      de: 'Spanien',
      fr: 'Espagne',
      es: 'España',
      ru: 'Испания',
      uk: 'Іспанія',
    },
    flag: 'https://flagcdn.com/w320/es.png',
    callingCode: '+34',
    phoneFormat: '(999)999-999',
  },
  {
    translations: {
      en: 'Sweden',
      sv: 'Sverige',
      de: 'Schweden',
      fr: 'Suède',
      es: 'Suecia',
      ru: 'Швеция',
      uk: 'Швеція',
    },
    flag: 'https://flagcdn.com/w320/se.png',
    callingCode: '+46',
    phoneFormat: '99-999-9999',
  },
  {
    translations: {
      en: 'Switzerland',
      sv: 'Schweiz',
      de: 'Schweiz',
      fr: 'Suisse',
      es: 'Suiza',
      ru: 'Швейцария',
      uk: 'Швейцарія',
    },
    flag: 'https://flagcdn.com/w320/ch.png',
    callingCode: '+41',
    phoneFormat: '99-999-9999',
  },
  {
    translations: {
      en: 'Turkey',
      sv: 'Turkiet',
      de: 'Türkei',
      fr: 'Turquie',
      es: 'Turquía',
      ru: 'Турция',
      uk: 'Туреччина',
    },
    flag: 'https://flagcdn.com/w320/tr.png',
    callingCode: '+90',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Ukraine',
      sv: 'Ukraina',
      de: 'Ukraina',
      fr: 'Ukraine',
      es: 'Ucrania',
      ru: 'Украина',
      uk: 'Україна',
    },
    flag: 'https://flagcdn.com/w320/ua.png',
    callingCode: '+380',
    phoneFormat: '(99)999-99-99',
  },
  {
    translations: {
      en: 'United Arab Emirates',
      sv: 'Förenade Arabemiraten',
      de: 'Vereinigte Arabische Emirate',
      fr: 'Émirats arabes unis',
      es: 'Emiratos Árabes Unidos',
      ru: 'Объединенные Арабские Эмираты',
      uk: "Об'єднані Арабські Емірати",
    },
    flag: 'https://flagcdn.com/w320/ae.png',
    callingCode: '+971',
    phoneFormat: '000 000 0000',
  },
  {
    translations: {
      en: 'United Kingdom',
      sv: 'Storbritannien',
      de: 'Vereinigtes Königreich',
      fr: 'Royaume-Uni',
      es: 'Reino Unido',
      ru: 'Великобритания',
      uk: 'Великобританія',
    },
    flag: 'https://flagcdn.com/w320/gb.png',
    callingCode: '+44',
    phoneFormat: '99-9999-9999',
  },
  {
    translations: {
      en: 'United States',
      sv: 'Förenta staterna',
      de: 'Vereinigte Staaten',
      fr: 'États-Unis',
      es: 'Estados Unidos',
      ru: 'Соединенные Штаты',
      uk: 'Сполучені Штати',
    },
    flag: 'https://flagcdn.com/w320/us.png',
    callingCode: '+1',
    phoneFormat: '(999)999-9999',
  },
  {
    translations: {
      en: 'Vietnam',
      sv: 'Vietnam',
      de: 'Vietnam',
      fr: 'Viêt Nam',
      es: 'Vietnam',
      ru: 'Вьетнам',
      uk: "В'єтнам",
    },
    flag: 'https://flagcdn.com/w320/vn.png',
    callingCode: '+84',
    phoneFormat: '0 000 000 00',
  },
];

export default countriesList;
