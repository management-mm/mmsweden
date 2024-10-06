import {
  AboutUs,
  Button,
  ContactUs,
  Description,
  Employee,
  Industry,
  Instructions,
  Label,
  NavBar,
  Placeholder,
  SellToUs,
  Title,
  WhyChooseUs,
} from '@enums/i18nConstants';

export const uk = {
  [NavBar.AllProducts]: 'Всі продукти',
  [NavBar.SellToUs]: 'Продайте нам',
  [NavBar.AboutUs]: 'Про нас',
  [NavBar.ContactUs]: "Зв'яжіться з нами",

  [Button.MyPriceQuote]: 'Моя цінова пропозиція',
  [Button.AllMachines]: 'Всі машини',
  [Button.NewArrivals]: 'Нові надходження',
  [Button.WatchOnYoutube]: 'Дивитися на YouTube',
  [Button.ShopNow]: 'Купити зараз',
  [Button.ShowMore]: 'Показати більше',
  [Button.ViewDetails]: 'Деталі',
  [Button.AddedToQuote]: 'Додано до пропозиції',
  [Button.RequestPricing]: 'Запит ціни',
  [Button.SubmitRequest]: 'Надіслати запит',
  [Button.AddMoreItems]: 'Додати більше товарів',
  [Button.AddProducts]: 'Додати товари',

  [Title.Industries]: 'Індустрії',
  [Title.LatestArrivals]: 'Останні надходження',
  [Title.WriteToUs]: 'Напишіть нам',
  [Title.Instructions]: 'Інструкції',
  [Title.Step]: 'Крок {{number}}',
  [Title.FormForSale]: 'Форма для продажу',
  [Title.VideoOverview]: 'Відеоогляд',
  [Title.YouMayAlsoLike]: 'Вам також може сподобатися',
  [Title.ItemsForQuote]: 'Товари для запиту ціни',
  [Title.RequestAQuote]: 'Запросити ціну',

  [Description.Industries]: 'Наші товари використовуються в таких галузях:',
  [Description.Hero]: 'Вживані машини - Нові товари',
  [Description.YearsMarket]: 'років на ринку',
  [Description.ProductsCatalogue]: 'товарів у каталозі',
  [Description.SuccessfulDeals]: 'успішних угод',
  [Description.AboutUsPage]:
    'Ласкаво просимо до Meat Machines, вашого надійного партнера у сфері високоякісного вживаного обладнання для переробки та упаковки продуктів харчування. Засновані в 2003 році, ми прагнемо надавати нашим клієнтам у всьому світі винятковий сервіс та обладнання найвищого класу.',
  [Description.AboutUsShort]: 'Наша історія',
  [Description.AboutUsLong]:
    '<1>З 2003 року Meat Machines є надійним джерелом високоякісного вживаного обладнання для переробки та пакування продуктів харчування. У наших чотирьох складах на півдні Швеції зберігається майже 2000 одиниць техніки, і ми гарантуємо першокласне обладнання найкращих виробників.</1> <1>Наша команда з понад 10 кваліфікованих фахівців, включаючи досвідчених електриків і механіків, ретельно обслуговує кожну одиницю. Тисячі задоволених клієнтів по всьому світу довіряють нам за надійність, якість та конкурентоспроможні ціни.</1> <1>Дозвольте нам допомогти вашому бізнесу процвітати з надійним обладнанням!</1>',
  [Description.SellToUs]:
    'Припиніть зберігати тисячі доларів на складах, коли ціна на ваше простоююче обладнання знижується щороку. <1/> Так на що ви чекаєте?',
  [Description.WriteToUs]: "Є питання? Наша команда зв'яжеться з вами негайно!",
  [Description.ContactUs]:
    'Привіт, ми раді відповісти на будь-які ваші запитання під час наших робочих годин.',
  [Description.Instructions]: '3 простих кроки, як продати',
  [Description.EmptyPriceQuoteList]:
    'Ваш список запитів цін наразі порожній. Додайте товари, щоб запросити ціну!',

  [SellToUs.FairTitle]: 'Справедливі та Конкурентоспроможні Пропозиції',
  [SellToUs.FairDesc]:
    'Ми пропонуємо справедливі та конкурентоспроможні пропозиції для вашого невикористаного обладнання, забезпечуючи вам найкращу цінність за машини, які більше не використовуються.',
  [SellToUs.QuickTitle]: 'Швидкі та Безпроблемні Транзакції',
  [SellToUs.QuickDesc]:
    'Скористайтеся найпростішим і найшвидшим способом продажу обладнання з попередньою оплатою та доставкою. Транзакції проходять швидко і без проблем, що економить ваш час і зусилля.',
  [SellToUs.SustainableTitle]: 'Сталий та Відповідальний Рециклінг',
  [SellToUs.SustainableDesc]:
    'Сприяйте більш сталому та відповідальному процесу переробки, надаючи машинам друге життя та зменшуючи відходи.',

  [Industry.MeatTitle]: "М'ясо",
  [Industry.MeatDesc]:
    "М'ясорубки, Міксери, Вакуумні наповнювачі, Упаковочне обладнання, Сепаратори тощо.",
  [Industry.FishTitle]: 'Риба',
  [Industry.FishDesc]:
    'Філетувальні машини, Сепаратори, Нарізчики, Видалювачі кісток, Термоформери тощо.',
  [Industry.BakeryTitle]: 'Випічка',
  [Industry.BakeryDesc]:
    'Міксери, Конвеєри, Металошукачі, Депозитори, Тістоміси тощо.',
  [Industry.DairyTitle]: 'Молочні продукти',
  [Industry.DairyDesc]:
    'Гомогенізатори, Наповнювачі, Ротаційні наповнювачі, Резервуари, Охолоджувальне обладнання, Міксери, Нарізчики тощо.',
  [Industry.VegetablesTitle]: 'Фрукти / Овочі',
  [Industry.VegetablesDesc]:
    'Нарізчики, Мийні машини, Ваги, Упаковочні машини, Металошукачі тощо.',
  [Industry.MedicinesTitle]: 'Ліки',
  [Industry.MedicinesDesc]:
    'Таблеточні преси, Упаковочні машини, Flowpack, Термоформери, Роботизовані лінії, Насоси, Міксери тощо.',

  [Instructions.Step1Title]: 'Надайте нам інформацію',
  [Instructions.Step1Desc]:
    'Ви заповнюєте форму, надаючи свої контактні дані, повний опис обладнання, яке ви хочете продати, вказуючи ціну, включаючи відео/фото.',
  [Instructions.Step2Title]: 'Швидка оцінка',
  [Instructions.Step2Desc]:
    "Наші досвідчені фахівці оцінять ваше обладнання та зв'яжуться з вами щодо нашого рішення.",
  [Instructions.Step3Title]: 'Угода!',
  [Instructions.Step3Desc]:
    'Ми домовляємося з вами про способи оплати, умови та доставку. Ми зазвичай займаємося доставкою, тому вам не потрібно про це турбуватися.',

  [AboutUs.WhoWeAreTitle]: 'Хто ми',
  [AboutUs.WhoWeAreDesc]:
    'Маючи понад два десятиліття досвіду в галузі, Meat Machines виросла і стала лідером ринку. Наша команда складається з понад 10 висококваліфікованих фахівців, які захоплені своєю справою. Ми працюємо з чотирьох великих складів, розташованих на півдні Швеції, де зберігається вражаючий інвентар майже 2000 одиниць техніки.',
  [AboutUs.WhatWeDoTitle]: 'Що ми робимо',
  [AboutUs.WhatWeDoDesc]:
    "Ми спеціалізуємося на купівлі та продажу вживаного обладнання для харчової переробки та пакування. Наш величезний інвентар забезпечує задоволення різноманітних потреб наших клієнтів, незалежно від їхніх вимог. Кожен елемент обладнання походить від найкращих постачальників і підтримується в чудовому стані завдяки нашим міцним зв'язкам із різними північними виробничими компаніями.",
  [AboutUs.OurCommitmentTitle]: 'Наше зобов’язання щодо якості',
  [AboutUs.OurCommitmentDesc]:
    'Якість є основою всього, що ми робимо. Ваша майбутня машина має велике щастя, що потрапила в руки наших кваліфікованих і відданих фахівців. Наша команда досвідчених електриків і механіків ретельно оглядає та підтримує кожну одиницю обладнання, яке проходить через наші двері. Завдяки тисячам одиниць техніки, що пройшли через їхні вмілі руки, наша команда забезпечує, що ви отримаєте надійну, ефективну та готову до роботи техніку.',
  [AboutUs.OurCustomersTitle]: 'Наші клієнти',
  [AboutUs.OurCustomersDesc]:
    'Наша прихильність до досконалості принесла нам тисячі задоволених клієнтів на всіх континентах. Ми пишаємося тим, що можемо відповідати та перевершувати очікування наших клієнтів, надаючи їм найкраще обладнання та сервіс на ринку.',
  [AboutUs.ContinuousTitle]: 'Безперервне вдосконалення',
  [AboutUs.ContinuousDesc]:
    'У Meat Machines ми віримо, що завжди є можливість для покращення. Незважаючи на наш великий досвід, ми постійно вчимося та розвиваємося, щоб краще вас обслуговувати. Ми постійно вдосконалюємо наші методи пошуку, покращуємо наші протоколи технічного обслуговування та оптимізуємо наші процеси доставки, щоб забезпечити швидші відповіді та більш конкурентоспроможні ціни. Наша мета — забезпечити вам найкраще обладнання та найкращий сервіс кожного разу.',
  [AboutUs.ThankYou]:
    'Дякуємо, що розглядаєте Meat Machines для ваших потреб у техніці для обробки та пакування харчових продуктів. Ми з нетерпінням чекаємо на співпрацю з вами та допомогу вашому бізнесу процвітати.',
  [AboutUs.FeelFree]:
    'Не соромтеся звертатися до нас із будь-якими запитаннями або дізнатися більше про наш великий асортимент.',

  [WhyChooseUs.YearsDesc]: 'років досвіду',
  [WhyChooseUs.TheBestTitle]: 'Найкраще',
  [WhyChooseUs.TheBestDesc]: 'Обладнання на ринку',
  [WhyChooseUs.ThousandsTitle]: 'Тисячі',
  [WhyChooseUs.ThousandsDesc]: 'задоволених клієнтів по всьому світу',

  [Employee.Hampus]: 'Хампус Вальгрен',
  [Employee.HampusDesc]: 'ПРОДАЖІ Швеція та за кордоном',
  [Employee.Hakan]: 'Хокан Вальгрен',
  [Employee.HakanDesc]: 'ГЕНЕРАЛЬНИЙ ДИРЕКТОР / ЗАКУПІВЛІ',
  [Employee.Erika]: 'Еріка Вальгрен',
  [Employee.ErikaDesc]: 'АДМІН. УПРАВЛІННЯ НЕРУХОМІСТЮ',
  [Employee.Eva]: 'Ева Андерссон',
  [Employee.EvaDesc]: 'ФІНАНСИ',
  [Employee.Catharine]: 'Катаріна Вальгрен',
  [Employee.CatharineDesc]: 'ФІНАНСИ',
  [Employee.Artem]: 'Артем Бортнік',
  [Employee.ArtemDesc]: 'АСИСТЕНТ ПРОДАЖ',

  [ContactUs.Info1]:
    'Якщо у вас є питання щодо наших <1>продуктів або доставки</1>, будь ласка, зв’яжіться з <1>Хампусом Вальгреном</1> (або його помічником <1>Артемом Бортником</1>)',
  [ContactUs.Info2]:
    'Якщо у вас є питання щодо <1>оплати</1>, будь ласка, зв’яжіться з <1>Евою Андерссон</1>',
  [ContactUs.ViewOnMap]: 'Переглянути на карті',
  [ContactUs.WorkingHours]: 'Робочі години',
  [ContactUs.MonFri]: 'Пн-Пт',

  [Label.Name]: "Ваше ім'я",
  [Label.Email]: 'Ваш email',
  [Label.Phone]: 'Ваш номер телефону',
  [Label.ProductName]: 'Назва продукту',
  [Label.Company]: 'Назва компанії',
  [Label.AttachPhotos]: 'Прикріпити фотографії',
  [Label.Country]: 'Виберіть країну',
  [Label.Description]: 'Повний опис',
  [Label.Message]: 'Повідомлення',
  [Label.Price]: 'Запропонована ціна',
  [Label.Subject]: 'Тема',

  [Placeholder.Name]: 'Марія Іваненко',
  [Placeholder.Email]: 'maria.ivanenko@example.com',
  [Placeholder.Price]: 'Вкажіть вашу запропоновану ціну',
  [Placeholder.Company]: 'Введіть назву вашої компанії',
  [Placeholder.Description]: 'Опишіть ваш продукт',
  [Placeholder.Message]: 'Напишіть ваше повідомлення',
  [Placeholder.ProductName]: 'Що ви продаєте?',
  [Placeholder.SearchProduct]: 'Введіть назву або ID продукту',
  [Placeholder.Search]: 'Пошук...',
  [Placeholder.Subject]: 'Тема вашого повідомлення',
};
