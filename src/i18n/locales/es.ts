import {
  AboutUs,
  Button,
  ContactUs,
  Description,
  Employee,
  Filter,
  Industry,
  Instructions,
  Label,
  NavBar,
  Pagination,
  Placeholder,
  Product,
  SellToUs,
  Title,
  WhyChooseUs,
} from '@enums/i18nConstants';

export const es = {
  [NavBar.Home]: 'Página Principal',
  [NavBar.AllProducts]: 'Todos los productos',
  [NavBar.SellToUs]: 'Véndenos',
  [NavBar.AboutUs]: 'Sobre nosotros',
  [NavBar.ContactUs]: 'Contáctanos',

  [Button.MyPriceQuote]: 'Mi cotización',
  [Button.AllMachines]: 'Todas las máquinas',
  [Button.NewArrivals]: 'Nuevas llegadas',
  [Button.WatchOnYoutube]: 'Ver en YouTube',
  [Button.ShopNow]: 'Compra ahora',
  [Button.ShowMore]: 'Mostrar más',
  [Button.ViewDetails]: 'Ver detalles',
  [Button.AddedToQuote]: 'Añadido a la cotización',
  [Button.RequestPricing]: 'Solicitar precio',
  [Button.SubmitRequest]: 'Enviar solicitud',
  [Button.AddMoreItems]: 'Agregar más artículos',
  [Button.GoToProducts]: 'Ir a productos',

  [Title.Industries]: 'Industrias',
  [Title.LatestArrivals]: 'Últimas llegadas',
  [Title.WriteToUs]: 'Escríbenos',
  [Title.Instructions]: 'Instrucciones',
  [Title.Step]: 'Paso {{number}}',
  [Title.FormForSale]: 'Formulario de venta',
  [Title.VideoOverview]: 'Visión general en video',
  [Title.YouMayAlsoBeInterestedIn]: 'También te puede interesar',
  [Title.ItemsForQuote]: 'Artículos para solicitud de precio',
  [Title.RequestAQuote]: 'Solicitar un precio',
  [Title.DateAdded]: 'Fecha añadida',
  [Title.EmptyCart]: 'Tu carrito está vacío',
  [Title.NoResults]:
    'No se encontraron resultados para su consulta. Intente ajustar los filtros.',
  [Title.Format]: 'formato {{number}}',

  [Description.Industries]:
    'Nuestros productos se utilizan en las siguientes industrias:',
  [Description.Hero]: 'Máquinas usadas - Productos nuevos',
  [Description.YearsMarket]: 'años en el mercado',
  [Description.ProductsCatalogue]: 'productos en el catálogo',
  [Description.SuccessfulDeals]: 'acuerdos exitosos',
  [Description.AboutUsPage]:
    'Bienvenido a Meat Machines, su socio de confianza en maquinaria de procesamiento y empaque de alimentos de alta calidad. Establecidos en 2003, nos hemos dedicado a ofrecer un servicio excepcional y equipos de primera categoría a nuestros clientes en todo el mundo.',
  [Description.AboutUsShort]: 'Nuestra historia',
  [Description.AboutUsLong]:
    '<1>Desde 2003, Meat Machines ha sido su fuente confiable de maquinaria de procesamiento y empaque de alimentos de alta calidad. Con casi 2,000 piezas en nuestros cuatro almacenes en el sur de Suecia, garantizamos equipos de primera categoría de los mejores fabricantes.</1> <1>Nuestro equipo de más de 10 profesionales capacitados, incluidos electricistas y mecánicos experimentados, mantiene meticulosamente cada unidad. Miles de clientes satisfechos en todo el mundo confían en nosotros por nuestra fiabilidad, calidad y precios competitivos.</1> <1>¡Permítanos ayudar a que su negocio prospere con maquinaria en la que puede confiar!</1>',
  [Description.SellToUs]:
    'Deje de almacenar miles de dólares en sus almacenes cuando el precio de su equipo inactivo disminuya cada año.<1/> Entonces, ¿qué está esperando?',
  [Description.WriteToUs]:
    '¿Tienes alguna pregunta? ¡Nuestro equipo se pondrá en contacto contigo rápidamente!',
  [Description.ContactUs]:
    'Hola, estamos encantados de responder a cualquier pregunta que puedas tener durante nuestro horario laboral.',
  [Description.Instructions]: '3 sencillos pasos para vender',
  [Description.EmptyPriceQuoteList]:
    'Su lista de solicitud de precios está actualmente vacía. ¡Agregue productos para solicitar un precio!',

  [SellToUs.FairTitle]: 'Ofertas Justas y Competitivas',
  [SellToUs.FairDesc]:
    'Ofrecemos ofertas justas y competitivas para su equipo inactivo, asegurando que obtenga el mejor valor por la maquinaria que ya no se utiliza.',
  [SellToUs.QuickTitle]: 'Transacciones Rápidas y Sin Complicaciones',
  [SellToUs.QuickDesc]:
    'Benefíciese del método más fácil y rápido para vender equipos, con pago anticipado y entrega incluida. Las transacciones son rápidas y sin complicaciones, ahorrándole tiempo y esfuerzo valiosos.',
  [SellToUs.SustainableTitle]: 'Reciclaje Sostenible y Responsable',
  [SellToUs.SustainableDesc]:
    'Contribuya a un proceso de reciclaje más sostenible y responsable al dar una segunda vida a la maquinaria y reducir los residuos.',

  [Industry.MeatTitle]: 'Carne',
  [Industry.MeatDesc]:
    'Molinos de carne, Mezcladoras, Rellenadoras al vacío, Maquinaria de embalaje, Separadores, etc.',
  [Industry.FishTitle]: 'Pescado',
  [Industry.FishDesc]:
    'Máquinas de fileteado, Separadores, Rebanadoras, Removedores de espinas, Termoformadoras, etc.',
  [Industry.BakeryTitle]: 'Panadería',
  [Industry.BakeryDesc]:
    'Mezcladoras, Transportadores, Detectores de metales, Depositadoras, Máquinas amasadoras, etc.',
  [Industry.DairyTitle]: 'Lácteos',
  [Industry.DairyDesc]:
    'Homogeneizadores, Máquinas de llenado, Llenadoras rotativas, Tanques, Equipos de refrigeración, Mezcladoras, Rebanadoras, etc.',
  [Industry.VegetablesTitle]: 'Frutas / Verduras',
  [Industry.VegetablesDesc]:
    'Rebanadoras, Máquinas de lavado, Balanzas, Máquinas de embalaje, Detectores de metales, etc.',
  [Industry.MedicinesTitle]: 'Medicamentos',
  [Industry.MedicinesDesc]:
    'Prensas de tabletas, Máquinas de embalaje, Flowpack, Termoformadoras, Líneas robotizadas, Bombas, Mezcladoras, etc.',

  [Instructions.Step1Title]: 'Danos información',
  [Instructions.Step1Desc]:
    'Llene el formulario proporcionando su información de contacto, una descripción completa del equipo que desea vender, indicando el precio, incluyendo video/fotos.',
  [Instructions.Step2Title]: 'Evaluación rápida',
  [Instructions.Step2Desc]:
    'Nuestros especialistas experimentados evaluarán su equipo y se pondrán en contacto con usted con respecto a nuestra decisión.',
  [Instructions.Step3Title]: '¡Trato hecho!',
  [Instructions.Step3Desc]:
    'Nos arreglamos con usted sobre los métodos de pago, términos y envío. Normalmente manejamos el envío, para que no tenga que preocuparse por eso.',

  [AboutUs.WhoWeAreTitle]: 'Quiénes somos',
  [AboutUs.WhoWeAreDesc]:
    'Con más de dos décadas de experiencia en la industria, Meat Machines ha crecido hasta convertirse en un líder en el mercado. Nuestro equipo está compuesto por más de 10 profesionales altamente cualificados que son apasionados por lo que hacen. Operamos desde cuatro amplios almacenes situados en el sur de Suecia, que albergan un impresionante inventario de casi 2,000 piezas de maquinaria.',
  [AboutUs.WhatWeDoTitle]: 'Lo que hacemos',
  [AboutUs.WhatWeDoDesc]:
    'Nos especializamos en la compra y venta de maquinaria de procesamiento y empaquetado de alimentos usada. Nuestro vasto inventario garantiza que podamos satisfacer las diversas necesidades de nuestros clientes, independientemente de sus requisitos específicos. Cada equipo es obtenido de los mejores proveedores y se mantiene en excelente estado, gracias a nuestras fuertes conexiones con varias empresas nórdicas de producción de alimentos.',
  [AboutUs.OurCommitmentTitle]: 'Nuestro compromiso con la calidad',
  [AboutUs.OurCommitmentDesc]:
    'La calidad está en el corazón de todo lo que hacemos. Su futura máquina tiene mucha suerte de haber terminado en nuestras manos capacitadas y dedicadas. Nuestro equipo de electricistas y mecánicos experimentados inspecciona y mantiene meticulosamente cada pieza de equipo que pasa por nuestras puertas. Con miles de unidades que han pasado por sus manos capaces, nuestro equipo se asegura de que reciba maquinaria que sea confiable, eficiente y lista para ofrecer su mejor rendimiento.',
  [AboutUs.OurCustomersTitle]: 'Nuestros clientes',
  [AboutUs.OurCustomersDesc]:
    'Nuestro compromiso con la excelencia nos ha ganado miles de clientes satisfechos en todos los continentes. Nos enorgullece nuestra capacidad para cumplir y superar las expectativas de nuestros clientes, proporcionándoles el mejor equipo y servicio en el mercado.',
  [AboutUs.ContinuousTitle]: 'Mejora continua',
  [AboutUs.ContinuousDesc]:
    'En Meat Machines, creemos que siempre hay margen de mejora. A pesar de nuestra amplia experiencia, estamos constantemente aprendiendo y evolucionando para servirle mejor. Continuamente refinamos nuestros métodos de búsqueda, mejoramos nuestros protocolos de mantenimiento y agilizamos nuestros procesos de envío para garantizar respuestas más rápidas y precios más competitivos. Nuestro objetivo es brindarle el mejor equipo y el mejor servicio, cada vez.',
  [AboutUs.ThankYou]:
    'Gracias por considerar Meat Machines para sus necesidades de maquinaria de procesamiento y embalaje de alimentos. Esperamos trabajar con usted y ayudar a que su negocio prospere.',
  [AboutUs.FeelFree]:
    'No dude en ponerse en contacto con nosotros para cualquier consulta o para obtener más información sobre nuestro extenso inventario.',

  [WhyChooseUs.YearsDesc]: 'años de experiencia',
  [WhyChooseUs.TheBestTitle]: 'Lo mejor',
  [WhyChooseUs.TheBestDesc]: 'Equipo en el mercado',
  [WhyChooseUs.ThousandsTitle]: 'Miles',
  [WhyChooseUs.ThousandsDesc]: 'de clientes satisfechos en todo el mundo',

  [Employee.Hampus]: 'Hampus Wahlgren',
  [Employee.HampusDesc]: 'VENTAS Suecia & extranjero',
  [Employee.Hakan]: 'Håkan Wahlgren',
  [Employee.HakanDesc]: 'CEO / ADQUISICIONES',
  [Employee.Erika]: 'Erika Walgreen',
  [Employee.ErikaDesc]: 'ADMIN. GESTIÓN DE PROPIEDADES',
  [Employee.Eva]: 'Eva Andersson',
  [Employee.EvaDesc]: 'FINANZAS',
  [Employee.Catharine]: 'Catharine Wahlgren',
  [Employee.CatharineDesc]: 'FINANZAS',
  [Employee.Artem]: 'Artem Bortnik',
  [Employee.ArtemDesc]: 'ASISTENTE DE VENTAS',

  [ContactUs.Info1]:
    'Si tiene preguntas sobre nuestros <1>productos o el envío</1>, por favor contacte con <1>Hampus Wahlgren</1> (o su asistente <1>Artem Bortnik</1>)',
  [ContactUs.Info2]:
    'Si tiene preguntas sobre <1>el pago</1>, por favor contacte con <1>Eva Andersson</1>',
  [ContactUs.ViewOnMap]: 'Ver en el mapa',
  [ContactUs.WorkingHours]: 'Horas laborales',
  [ContactUs.MonFri]: 'Lun-Vie',

  [Label.Name]: 'Tu nombre',
  [Label.Email]: 'Tu correo electrónico',
  [Label.Phone]: 'Tu número de teléfono',
  [Label.ProductName]: 'Nombre del producto',
  [Label.Company]: 'Nombre de la empresa',
  [Label.AttachPhotos]: 'Adjuntar fotos',
  [Label.Country]: 'Elige tu país',
  [Label.Description]: 'Descripción completa',
  [Label.Message]: 'Mensaje',
  [Label.Price]: 'Precio de oferta',
  [Label.Subject]: 'Asunto',

  [Placeholder.Name]: 'Juan Pérez',
  [Placeholder.Email]: 'juan.perez@example.com',
  [Placeholder.Price]: 'Fija tu precio de oferta',
  [Placeholder.Company]: 'Introduce el nombre de tu empresa',
  [Placeholder.Description]: 'Describe tu producto',
  [Placeholder.Message]: 'Escribe tu mensaje',
  [Placeholder.ProductName]: '¿Qué estás vendiendo?',
  [Placeholder.SearchProduct]: 'Introduce el nombre o ID del producto',
  [Placeholder.Search]: 'Buscar...',
  [Placeholder.Subject]: 'Asunto de tu mensaje',
  [Placeholder.SelectCountry]: 'Seleccione su país',

  [Filter.Category]: 'Categoría',
  [Filter.Manufacturer]: 'Fabricante',
  [Filter.Industry]: 'Industria',
  [Filter.Condition]: 'Condición',
  [Filter.Found]: 'Se encontraron {{number}} productos',
  [Filter.Filters]: 'Filtros',
  [Filter.New]: 'Nuevo',
  [Filter.Used]: 'Usado',
  [Filter.Reset]: 'Restablecer filtros',

  [Product.Dimensions]: 'Dimensiones',
  [Product.Description]: 'Descripción',

  [Pagination.Next]: 'Siguiente',
  [Pagination.Previous]: 'Anterior',
};
