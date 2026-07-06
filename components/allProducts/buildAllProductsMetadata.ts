import type { Metadata } from 'next';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type SearchParams = {
  title?: string;
  manufacturer?: string;
  condition?: string;
  page?: string;
  category?: string | string[];
  industry?: string | string[];
};

export type AllProductsSeoData = {
  title: string;
  description: string;
  keywords?: string[];
  h1: string;
  intro: string;
};

const normalizeArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const allProductsSeoData: Record<AppLocale, AllProductsSeoData> = {
  en: {
    title: 'Used Food Processing Machines for Sale | MM Sweden',
    description:
      'Browse used food processing machines for meat, fish, dairy, bakery, packaging and production lines. MM Sweden offers a wide stock of used food machinery.',
    keywords: [
      'used food processing machines',
      'used food machinery',
      'used meat processing equipment',
      'used packaging machines',
      'food production equipment',
    ],
    h1: 'Used Food Processing Machines for Sale',
    intro:
      'MM Sweden carries a wide range of used food processing machines for meat, fish, dairy, bakery, packaging and general production environments. Whether you are equipping a small processor, upgrading an existing line or searching for machinery for higher-throughput production, we can help you find equipment that matches your product, capacity and budget. Our stock includes machines for cutting, mixing, forming, cooking, freezing, conveying, inspection and packaging applications.\n\nOur inventory changes regularly, and many machines in our warehouse are not yet listed on the website. If you cannot find the exact equipment you need, <a href="/en/contact-us">contact us</a> with your product type, throughput requirements or preferred machine category, and we will help match you with suitable used equipment from our available stock.',
  },

  sv: {
    title: 'Begagnade livsmedelsmaskiner till salu | MM Sweden',
    description:
      'Utforska begagnade livsmedelsmaskiner för kött, fisk, mejeri, bageri, förpackning och produktionslinjer. MM Sweden erbjuder ett brett lager av begagnade maskiner.',
    keywords: [
      'begagnade livsmedelsmaskiner',
      'begagnad livsmedelsutrustning',
      'begagnade köttmaskiner',
      'begagnade förpackningsmaskiner',
      'utrustning för livsmedelsproduktion',
    ],
    h1: 'Begagnade livsmedelsmaskiner till salu',
    intro:
      'MM Sweden har ett brett utbud av begagnade livsmedelsmaskiner för kött, fisk, mejeri, bageri, förpackning och allmän produktion. Oavsett om du utrustar en mindre producent, uppgraderar en befintlig linje eller söker maskiner för produktion med högre kapacitet hjälper vi dig att hitta utrustning som passar din produkt, kapacitet och budget. Vårt lager omfattar maskiner för skärning, blandning, formning, tillagning, frysning, transport, inspektion och förpackning.\n\nVårt sortiment förändras regelbundet, och många maskiner på vårt lager finns ännu inte publicerade på webbplatsen. Om du inte hittar exakt den utrustning du behöver kan du <a href="/sv/contact-us">kontakta oss</a> med produkttyp, kapacitetskrav eller önskad maskinkategori, så hjälper vi dig att hitta lämplig begagnad utrustning från vårt tillgängliga lager.',
  },

  de: {
    title: 'Gebrauchte Lebensmittelmaschinen zu verkaufen | MM Sweden',
    description:
      'Entdecken Sie gebrauchte Lebensmittelmaschinen für Fleisch, Fisch, Molkerei, Bäckerei, Verpackung und Produktionslinien. MM Sweden bietet ein breites Lager an gebrauchten Maschinen.',
    keywords: [
      'gebrauchte Lebensmittelmaschinen',
      'gebrauchte Lebensmitteltechnik',
      'gebrauchte Fleischereimaschinen',
      'gebrauchte Verpackungsmaschinen',
      'Maschinen für Lebensmittelproduktion',
    ],
    h1: 'Gebrauchte Lebensmittelmaschinen zu verkaufen',
    intro:
      'MM Sweden führt ein breites Sortiment an gebrauchten Lebensmittelmaschinen für Fleisch, Fisch, Molkerei, Bäckerei, Verpackung und allgemeine Produktion. Ob Sie einen kleineren Betrieb ausstatten, eine bestehende Linie modernisieren oder Maschinen für eine Produktion mit höherem Durchsatz suchen – wir helfen Ihnen, Ausrüstung zu finden, die zu Ihrem Produkt, Ihrer Kapazität und Ihrem Budget passt. Unser Bestand umfasst Maschinen zum Schneiden, Mischen, Formen, Garen, Gefrieren, Fördern, Prüfen und Verpacken.\n\nUnser Lagerbestand ändert sich regelmäßig, und viele Maschinen in unserem Lager sind noch nicht auf der Website veröffentlicht. Wenn Sie die passende Ausrüstung nicht finden, <a href="/de/contact-us">kontaktieren Sie uns</a> mit Produkttyp, Leistungsanforderungen oder gewünschter Maschinenkategorie, und wir helfen Ihnen, geeignete gebrauchte Technik aus unserem verfügbaren Bestand zu finden.',
  },

  fr: {
    title:
      'Machines de transformation alimentaire d’occasion à vendre | MM Sweden',
    description:
      'Parcourez des machines de transformation alimentaire d’occasion pour la viande, le poisson, les produits laitiers, la boulangerie, l’emballage et les lignes de production.',
    keywords: [
      'machines alimentaires occasion',
      'machines transformation alimentaire occasion',
      'machines viande occasion',
      'machines emballage occasion',
      'équipement production alimentaire',
    ],
    h1: 'Machines de transformation alimentaire d’occasion à vendre',
    intro:
      'MM Sweden propose une large gamme de machines de transformation alimentaire d’occasion pour la viande, le poisson, les produits laitiers, la boulangerie, le conditionnement et la production générale. Que vous équipiez un petit atelier de transformation, modernisiez une ligne existante ou recherchiez des machines pour une production à plus haut débit, nous pouvons vous aider à trouver un équipement adapté à votre produit, à votre capacité et à votre budget. Notre stock comprend des machines pour la découpe, le mélange, le formage, la cuisson, la congélation, le convoyage, l’inspection et l’emballage.\n\nNotre inventaire évolue régulièrement, et de nombreuses machines présentes dans notre entrepôt ne sont pas encore publiées sur le site. Si vous ne trouvez pas l’équipement exact dont vous avez besoin, <a href="/fr/contact-us">contactez-nous</a> avec votre type de produit, vos besoins de capacité ou la catégorie de machine souhaitée, et nous vous aiderons à trouver un équipement d’occasion adapté parmi notre stock disponible.',
  },

  es: {
    title: 'Máquinas usadas de procesamiento de alimentos | MM Sweden',
    description:
      'Explore máquinas usadas de procesamiento de alimentos para carne, pescado, lácteos, panadería, envasado y líneas de producción. MM Sweden ofrece un amplio stock.',
    keywords: [
      'máquinas usadas de procesamiento de alimentos',
      'maquinaria alimentaria usada',
      'equipos cárnicos usados',
      'máquinas de envasado usadas',
      'equipos para producción alimentaria',
    ],
    h1: 'Máquinas usadas de procesamiento de alimentos en venta',
    intro:
      'MM Sweden cuenta con una amplia gama de máquinas usadas de procesamiento de alimentos para carne, pescado, lácteos, panadería, envasado y producción general. Tanto si está equipando un pequeño procesador, modernizando una línea existente o buscando maquinaria para una producción de mayor capacidad, podemos ayudarle a encontrar equipos que se adapten a su producto, capacidad y presupuesto. Nuestro stock incluye máquinas para corte, mezcla, formado, cocción, congelación, transporte, inspección y envasado.\n\nNuestro inventario cambia con regularidad, y muchas máquinas de nuestro almacén aún no están publicadas en el sitio web. Si no encuentra el equipo exacto que necesita, <a href="/es/contact-us">contáctenos</a> con su tipo de producto, requisitos de capacidad o categoría de máquina preferida, y le ayudaremos a encontrar equipos usados adecuados en nuestro stock disponible.',
  },

  ru: {
    title: 'Б/у пищевое оборудование в продаже | MM Sweden',
    description:
      'Смотрите б/у пищевое оборудование для мяса, рыбы, молочной продукции, хлебопекарного производства, упаковки и производственных линий. MM Sweden предлагает широкий склад оборудования.',
    keywords: [
      'б/у пищевое оборудование',
      'подержанное пищевое оборудование',
      'б/у мясоперерабатывающее оборудование',
      'б/у упаковочные машины',
      'оборудование для пищевого производства',
    ],
    h1: 'Б/у пищевое оборудование в продаже',
    intro:
      'MM Sweden предлагает широкий выбор б/у пищевого оборудования для мясной, рыбной, молочной, хлебопекарной, упаковочной и общей производственной отрасли. Если вы оснащаете небольшое производство, модернизируете существующую линию или ищете оборудование для более высокой производительности, мы поможем подобрать машины под ваш продукт, требуемую мощность и бюджет. В наличии может быть оборудование для нарезки, смешивания, формования, тепловой обработки, заморозки, транспортировки, инспекции и упаковки.\n\nАссортимент регулярно обновляется, и многие машины на нашем складе ещё не опубликованы на сайте. Если вы не нашли нужное оборудование, <a href="/ru/contact-us">свяжитесь с нами</a> и укажите тип продукта, требуемую производительность или интересующую категорию машин — мы поможем подобрать подходящее б/у оборудование из доступного склада.',
  },

  uk: {
    title: 'Вживане харчове обладнання у продажу | MM Sweden',
    description:
      'Перегляньте вживане харчове обладнання для м’яса, риби, молочної продукції, хлібопекарного виробництва, пакування та виробничих ліній.',
    keywords: [
      'вживане харчове обладнання',
      'вживані харчові машини',
      'вживане м’ясопереробне обладнання',
      'вживані пакувальні машини',
      'обладнання для харчового виробництва',
    ],
    h1: 'Вживане харчове обладнання у продажу',
    intro:
      'MM Sweden пропонує широкий вибір вживаного харчового обладнання для м’ясної, рибної, молочної, хлібопекарської, пакувальної та загальної виробничої галузі. Якщо ви оснащуєте невелике виробництво, модернізуєте наявну лінію або шукаєте обладнання для більшої продуктивності, ми допоможемо підібрати машини відповідно до вашого продукту, потрібної потужності та бюджету. У наявності може бути обладнання для нарізання, змішування, формування, теплової обробки, заморожування, транспортування, інспекції та пакування.\n\nАсортимент регулярно змінюється, і багато машин на нашому складі ще не опубліковані на сайті. Якщо ви не знайшли потрібне обладнання, <a href="/uk/contact-us">зв’яжіться з нами</a> та вкажіть тип продукту, потрібну продуктивність або бажану категорію машин — ми допоможемо підібрати відповідне вживане обладнання з доступного складу.',
  },

  pl: {
    title: 'Używane maszyny do przetwórstwa spożywczego | MM Sweden',
    description:
      'Przeglądaj używane maszyny do przetwórstwa spożywczego dla mięsa, ryb, nabiału, piekarni, pakowania i linii produkcyjnych. MM Sweden oferuje szeroki magazyn maszyn.',
    keywords: [
      'używane maszyny spożywcze',
      'używane maszyny do przetwórstwa spożywczego',
      'używane maszyny mięsne',
      'używane maszyny pakujące',
      'sprzęt do produkcji spożywczej',
    ],
    h1: 'Używane maszyny do przetwórstwa spożywczego na sprzedaż',
    intro:
      'MM Sweden oferuje szeroki wybór używanych maszyn do przetwórstwa spożywczego dla branży mięsnej, rybnej, mleczarskiej, piekarniczej, pakowania oraz ogólnej produkcji. Niezależnie od tego, czy wyposażasz mniejszy zakład, modernizujesz istniejącą linię czy szukasz maszyn do produkcji o większej wydajności, pomożemy dobrać urządzenia odpowiednie do produktu, wymaganej przepustowości i budżetu. Nasz asortyment obejmuje maszyny do krojenia, mieszania, formowania, gotowania, mrożenia, transportu, inspekcji i pakowania.\n\nStan magazynowy zmienia się regularnie, a wiele maszyn dostępnych w naszym magazynie nie jest jeszcze opublikowanych na stronie. Jeśli nie możesz znaleźć dokładnie takiego urządzenia, jakiego potrzebujesz, <a href="/pl/contact-us">skontaktuj się z nami</a> i podaj typ produktu, wymaganą wydajność lub preferowaną kategorię maszyny — pomożemy dobrać odpowiedni używany sprzęt z dostępnego magazynu.',
  },
};

type Props = {
  locale: AppLocale;
  path: string;
  searchParams: SearchParams;
};

export function getAllProductsSeoData(locale: AppLocale): AllProductsSeoData {
  return allProductsSeoData[locale] || allProductsSeoData.en;
}

export function buildAllProductsMetadata({
  locale,
  path,
  searchParams,
}: Props): Metadata {
  const seo = getAllProductsSeoData(locale);

  const hasFilters =
    !!searchParams.title ||
    !!searchParams.manufacturer ||
    !!searchParams.condition ||
    normalizeArray(searchParams.category).length > 0 ||
    normalizeArray(searchParams.industry).length > 0;

  const pageNumber = Number(searchParams.page);
  const hasPagination = Number.isFinite(pageNumber) && pageNumber > 1;

  return createPageMetadata({
    locale,
    path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    noIndex: hasFilters || hasPagination,
  });
}
