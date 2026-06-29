import type { AppLocale } from '@i18n/config';

type PageSeoEntry = {
  title: string;
  description: string;
  keywords?: string[];
};

type LocalizedPageSeo = Record<AppLocale, PageSeoEntry>;

const homeSeo: LocalizedPageSeo = {
  en: {
    title: 'Used Food Processing and Packaging Equipment | Meat Machines',
    description:
      'Meat Machines supplies used food processing and packaging equipment for the food industry. Browse nearly 2,000 machines in stock.',
    keywords: [
      'used food processing equipment',
      'used packaging equipment',
      'food machinery',
      'meat processing equipment',
      'used food machinery',
    ],
  },
  sv: {
    title: 'Begagnade livsmedels- och förpackningsmaskiner | Meat Machines',
    description:
      'Meat Machines säljer begagnade livsmedels- och förpackningsmaskiner för livsmedelsindustrin. Se vårt lager med nästan 2 000 maskiner.',
    keywords: [
      'begagnade livsmedelsmaskiner',
      'begagnade förpackningsmaskiner',
      'livsmedelsmaskiner',
      'köttmaskiner',
      'begagnad livsmedelsutrustning',
    ],
  },
  de: {
    title: 'Gebrauchte Lebensmittel- und Verpackungsmaschinen | Meat Machines',
    description:
      'Meat Machines liefert gebrauchte Lebensmittel- und Verpackungsmaschinen für die Lebensmittelindustrie. Entdecken Sie fast 2.000 Maschinen auf Lager.',
    keywords: [
      'gebrauchte Lebensmittelmaschinen',
      'gebrauchte Verpackungsmaschinen',
      'Lebensmitteltechnik',
      'Fleischverarbeitungsmaschinen',
      'gebrauchte Lebensmitteltechnik',
    ],
  },
  fr: {
    title: 'Machines alimentaires et d’emballage d’occasion | Meat Machines',
    description:
      'Meat Machines fournit des machines alimentaires et d’emballage d’occasion pour l’industrie alimentaire. Découvrez près de 2 000 machines en stock.',
    keywords: [
      'machines alimentaires occasion',
      'machines emballage occasion',
      'équipement alimentaire',
      'machines transformation viande',
      'matériel alimentaire occasion',
    ],
  },
  es: {
    title: 'Maquinaria alimentaria y de envasado usada | Meat Machines',
    description:
      'Meat Machines suministra maquinaria alimentaria y de envasado usada para la industria alimentaria. Explore casi 2.000 máquinas en stock.',
    keywords: [
      'maquinaria alimentaria usada',
      'maquinaria de envasado usada',
      'equipos alimentarios',
      'maquinaria cárnica',
      'maquinaria industrial alimentaria usada',
    ],
  },
  ru: {
    title: 'Б/у пищевое и упаковочное оборудование | Meat Machines',
    description:
      'Meat Machines поставляет б/у пищевое и упаковочное оборудование для пищевой промышленности. В наличии почти 2 000 машин.',
    keywords: [
      'б/у пищевое оборудование',
      'б/у упаковочное оборудование',
      'оборудование для пищевой промышленности',
      'мясоперерабатывающее оборудование',
      'подержанное пищевое оборудование',
    ],
  },
  uk: {
    title: 'Вживане харчове та пакувальне обладнання | Meat Machines',
    description:
      'Meat Machines постачає вживане харчове та пакувальне обладнання для харчової промисловості. Перегляньте майже 2 000 машин у наявності.',
    keywords: [
      'вживане харчове обладнання',
      'вживане пакувальне обладнання',
      'харчове обладнання',
      'м’ясопереробне обладнання',
      'промислове харчове обладнання',
    ],
  },
  pl: {
    title: 'Używane maszyny spożywcze i pakujące | Meat Machines',
    description:
      'Meat Machines dostarcza używane maszyny spożywcze i pakujące dla przemysłu spożywczego. Sprawdź prawie 2 000 maszyn w magazynie.',
    keywords: [
      'używane maszyny spożywcze',
      'używane maszyny pakujące',
      'maszyny dla przemysłu spożywczego',
      'maszyny do przetwórstwa mięsa',
      'używany sprzęt spożywczy',
    ],
  },
};

const aboutUsSeo: LocalizedPageSeo = {
  en: {
    title: 'About Us | Meat Machines',
    description:
      'Learn more about Meat Machines and our experience in used food processing and packaging equipment.',
  },
  sv: {
    title: 'Om oss | Meat Machines',
    description:
      'Läs mer om Meat Machines och vår erfarenhet av begagnade livsmedels- och förpackningsmaskiner.',
  },
  de: {
    title: 'Über uns | Meat Machines',
    description:
      'Erfahren Sie mehr über Meat Machines und unsere Erfahrung mit gebrauchten Lebensmittel- und Verpackungsmaschinen.',
  },
  fr: {
    title: 'À propos de nous | Meat Machines',
    description:
      'En savoir plus sur Meat Machines et notre expérience dans les machines alimentaires et d’emballage d’occasion.',
  },
  es: {
    title: 'Sobre nosotros | Meat Machines',
    description:
      'Conozca más sobre Meat Machines y nuestra experiencia en maquinaria alimentaria y de envasado usada.',
  },
  ru: {
    title: 'О нас | Meat Machines',
    description:
      'Узнайте больше о Meat Machines и нашем опыте работы с б/у пищевым и упаковочным оборудованием.',
  },
  uk: {
    title: 'Про нас | Meat Machines',
    description:
      'Дізнайтеся більше про Meat Machines та наш досвід роботи з вживаним харчовим і пакувальним обладнанням.',
  },
  pl: {
    title: 'O nas | Meat Machines',
    description:
      'Dowiedz się więcej o Meat Machines i naszym doświadczeniu w zakresie używanych maszyn spożywczych i pakujących.',
  },
};

const contactUsSeo: LocalizedPageSeo = {
  en: {
    title: 'Contact Us | Meat Machines',
    description:
      'Get in touch with Meat Machines. Our team will answer your questions about food processing machinery.',
  },
  sv: {
    title: 'Kontakta oss | Meat Machines',
    description:
      'Kontakta Meat Machines. Vårt team svarar på dina frågor om livsmedelsmaskiner och begagnad produktionsutrustning.',
  },
  de: {
    title: 'Kontakt | Meat Machines',
    description:
      'Kontaktieren Sie Meat Machines. Unser Team beantwortet Ihre Fragen zu Lebensmittelmaschinen und gebrauchter Produktionsausrüstung.',
  },
  fr: {
    title: 'Contactez-nous | Meat Machines',
    description:
      'Contactez Meat Machines. Notre équipe répond à vos questions sur les machines alimentaires et les équipements de production d’occasion.',
  },
  es: {
    title: 'Contáctenos | Meat Machines',
    description:
      'Póngase en contacto con Meat Machines. Nuestro equipo responderá a sus preguntas sobre maquinaria alimentaria y equipos de producción usados.',
  },
  ru: {
    title: 'Связаться с нами | Meat Machines',
    description:
      'Свяжитесь с Meat Machines. Наша команда ответит на ваши вопросы о пищевом оборудовании и б/у производственных машинах.',
  },
  uk: {
    title: 'Зв’язатися з нами | Meat Machines',
    description:
      'Зв’яжіться з Meat Machines. Наша команда відповість на ваші запитання про харчове обладнання та вживані виробничі машини.',
  },
  pl: {
    title: 'Kontakt | Meat Machines',
    description:
      'Skontaktuj się z Meat Machines. Nasz zespół odpowie na Twoje pytania dotyczące maszyn spożywczych i używanego sprzętu produkcyjnego.',
  },
};

const sellToUsSeo: LocalizedPageSeo = {
  en: {
    title: 'Sell to Us | Meat Machines',
    description:
      'Sell your used food processing and packaging equipment to Meat Machines. We offer fair deals, quick pickup and hassle-free transactions.',
    keywords: [
      'sell used food machinery',
      'sell food processing equipment',
      'sell packaging equipment',
      'used food machinery buyer',
      'sell industrial food equipment',
    ],
  },
  sv: {
    title: 'Sälj till oss | Meat Machines',
    description:
      'Sälj dina begagnade livsmedels- och förpackningsmaskiner till Meat Machines. Vi erbjuder rättvisa affärer, snabb upphämtning och smidiga transaktioner.',
    keywords: [
      'sälj begagnade livsmedelsmaskiner',
      'sälj livsmedelsutrustning',
      'sälj förpackningsmaskiner',
      'köpare av begagnade maskiner',
      'sälj industriell livsmedelsutrustning',
    ],
  },
  de: {
    title: 'An uns verkaufen | Meat Machines',
    description:
      'Verkaufen Sie Ihre gebrauchten Lebensmittel- und Verpackungsmaschinen an Meat Machines. Wir bieten faire Angebote, schnelle Abholung und unkomplizierte Abwicklung.',
    keywords: [
      'gebrauchte Lebensmittelmaschinen verkaufen',
      'Lebensmittelmaschinen verkaufen',
      'Verpackungsmaschinen verkaufen',
      'Käufer gebrauchter Maschinen',
      'Industrieanlagen Lebensmittel verkaufen',
    ],
  },
  fr: {
    title: 'Vendez-nous vos machines | Meat Machines',
    description:
      'Vendez vos machines alimentaires et d’emballage d’occasion à Meat Machines. Nous proposons des offres équitables, un enlèvement rapide et des transactions simples.',
    keywords: [
      'vendre machines alimentaires occasion',
      'vendre équipement alimentaire',
      'vendre machines emballage',
      'acheteur machines alimentaires occasion',
      'vendre équipement industriel alimentaire',
    ],
  },
  es: {
    title: 'Véndanos su maquinaria | Meat Machines',
    description:
      'Venda su maquinaria alimentaria y de envasado usada a Meat Machines. Ofrecemos acuerdos justos, recogida rápida y transacciones sin complicaciones.',
    keywords: [
      'vender maquinaria alimentaria usada',
      'vender equipos alimentarios',
      'vender maquinaria de envasado',
      'comprador maquinaria alimentaria usada',
      'vender equipos industriales alimentarios',
    ],
  },
  ru: {
    title: 'Продать нам оборудование | Meat Machines',
    description:
      'Продайте своё б/у пищевое и упаковочное оборудование компании Meat Machines. Мы предлагаем честные условия, быстрый вывоз и простую сделку без лишних сложностей.',
    keywords: [
      'продать б/у пищевое оборудование',
      'продать оборудование для пищевого производства',
      'продать упаковочное оборудование',
      'покупатель б/у пищевого оборудования',
      'продать промышленное пищевое оборудование',
    ],
  },
  uk: {
    title: 'Продати нам обладнання | Meat Machines',
    description:
      'Продайте своє вживане харчове та пакувальне обладнання компанії Meat Machines. Ми пропонуємо чесні умови, швидкий вивіз і просту угоду без зайвих складнощів.',
    keywords: [
      'продати вживане харчове обладнання',
      'продати обладнання для харчового виробництва',
      'продати пакувальне обладнання',
      'покупець вживаного харчового обладнання',
      'продати промислове харчове обладнання',
    ],
  },
  pl: {
    title: 'Sprzedaj nam maszyny | Meat Machines',
    description:
      'Sprzedaj swoje używane maszyny spożywcze i pakujące firmie Meat Machines. Oferujemy uczciwe warunki, szybki odbiór i prostą transakcję bez komplikacji.',
    keywords: [
      'sprzedam używane maszyny spożywcze',
      'sprzedam sprzęt spożywczy',
      'sprzedam maszyny pakujące',
      'kupiec używanych maszyn spożywczych',
      'sprzedam przemysłowe maszyny spożywcze',
    ],
  },
};

export const pageSeo = {
  home: homeSeo,
  aboutUs: aboutUsSeo,
  contactUs: contactUsSeo,
  sellToUs: sellToUsSeo,
} as const;

export function getPageSeo(page: keyof typeof pageSeo, locale: AppLocale) {
  return pageSeo[page][locale];
}
