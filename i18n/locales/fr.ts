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

export const fr = {
  [NavBar.Home]: 'Accueil',
  [NavBar.AllProducts]: 'Tous les produits',
  [NavBar.SellToUs]: 'Vendez-nous',
  [NavBar.AboutUs]: 'À propos de nous',
  [NavBar.ContactUs]: 'Contactez-nous',

  [Button.MyPriceQuote]: 'Mon devis',
  [Button.AllMachines]: 'Toutes les machines',
  [Button.NewArrivals]: 'Nouveautés',
  [Button.WatchOnYoutube]: 'Regarder sur YouTube',
  [Button.ShopNow]: 'Acheter maintenant',
  [Button.ShowMore]: 'Afficher plus',
  [Button.ViewDetails]: 'Voir les détails',
  [Button.AddedToQuote]: 'Ajouté au devis',
  [Button.RequestPricing]: 'Demander le prix',
  [Button.SubmitRequest]: 'Envoyer la demande',
  [Button.AddMoreItems]: "Ajouter d'autres articles",
  [Button.GoToProducts]: 'Aller aux produits',

  [Title.Industries]: 'Industries',
  [Title.LatestArrivals]: 'Dernières arrivées',
  [Title.WriteToUs]: 'Écrivez-nous',
  [Title.Instructions]: 'Instructions',
  [Title.Step]: 'Étape {{number}}',
  [Title.FormForSale]: 'Formulaire de vente',
  [Title.VideoOverview]: 'Aperçu vidéo',
  [Title.YouMayAlsoBeInterestedIn]: 'Vous pourriez aussi être intéressé par',
  [Title.ItemsForQuote]: 'Articles pour demande de prix',
  [Title.RequestAQuote]: 'Demander un devis',
  [Title.DateAdded]: 'Date ajoutée',
  [Title.EmptyCart]: 'Votre panier est vide',
  [Title.NoResults]:
    "Aucun résultat trouvé pour votre demande. Veuillez essayer d'ajuster les filtres.",
  [Title.Format]: 'format {{number}}',

  [Description.Industries]:
    'Nos produits sont utilisés dans les industries suivantes :',
  [Description.Hero]: "Machines d'occasion - Produits neufs",
  [Description.YearsMarket]: 'années sur le marché',
  [Description.ProductsCatalogue]: 'produits dans le catalogue',
  [Description.SuccessfulDeals]: 'transactions réussies',
  [Description.AboutUsPage]:
    "Bienvenue chez Meat Machines, votre partenaire de confiance en matière de machines de traitement et d'emballage des aliments de haute qualité. Fondée en 2003, nous nous consacrons à fournir un service exceptionnel et un équipement de premier choix à nos clients du monde entier.",
  [Description.AboutUsShort]: 'Notre histoire',
  [Description.AboutUsLong]:
    "<1>Depuis 2003, Meat Machines est votre source de confiance pour des machines de traitement et d'emballage des aliments de haute qualité. Avec près de 2 000 pièces dans nos quatre entrepôts du sud de la Suède, nous assurons du matériel de premier choix provenant des meilleurs fabricants.</1> <1>Notre équipe de plus de 10 professionnels qualifiés, comprenant des électriciens et des mécaniciens expérimentés, maintient chaque unité avec soin. Des milliers de clients satisfaits à travers le monde nous font confiance pour notre fiabilité, notre qualité et nos prix compétitifs.</1> <1>Laissez-nous aider votre entreprise à prospérer avec des machines fiables !</1>",
  [Description.SellToUs]:
    "Arrêtez de stocker des milliers de dollars dans vos entrepôts alors que la valeur de votre équipement inutilisé diminue chaque année.<1/> Alors, qu'attendez-vous ?",
  [Description.WriteToUs]:
    'Vous avez des questions ? Notre équipe vous répondra rapidement !',
  [Description.ContactUs]:
    'Bonjour, nous sommes heureux de répondre à toutes vos questions pendant nos heures de travail.',
  [Description.Instructions]: '3 étapes faciles pour vendre',
  [Description.EmptyPriceQuoteList]:
    'Votre liste de demande de prix est actuellement vide. Ajoutez des produits pour demander un prix !',

  [SellToUs.FairTitle]: 'Offres Équitables et Compétitives',
  [SellToUs.FairDesc]:
    'Nous vous proposons des offres équitables et compétitives pour votre équipement inactif, garantissant que vous obtenez la meilleure valeur pour les machines qui ne sont plus utilisées.',
  [SellToUs.QuickTitle]: 'Transactions Rapides et Sans Tracas',
  [SellToUs.QuickDesc]:
    'Bénéficiez de la méthode la plus simple et la plus rapide pour vendre votre équipement, avec un paiement anticipé et une livraison inclus. Les transactions sont rapides et sans tracas, ce qui vous fait gagner un temps et des efforts précieux.',
  [SellToUs.SustainableTitle]: 'Recyclage Durable et Responsable',
  [SellToUs.SustainableDesc]:
    'Contribuez à un processus de recyclage plus durable et responsable en donnant une seconde vie aux machines et en réduisant les déchets.',

  [Industry.MeatTitle]: 'Viande',
  [Industry.MeatDesc]:
    "Hachoirs à viande, Mélangeurs, Remplisseuses sous vide, Machines d'emballage, Séparateurs, etc.",
  [Industry.FishTitle]: 'Poisson',
  [Industry.FishDesc]:
    "Machines à fileter, Séparateurs, Trancheurs, Dénudeurs d'arêtes, Thermoformeuses, etc.",
  [Industry.BakeryTitle]: 'Boulangerie',
  [Industry.BakeryDesc]:
    'Mélangeurs, Convoyeurs, Détecteurs de métaux, Déposeurs, Pétrins, etc.',
  [Industry.DairyTitle]: 'Produits laitiers',
  [Industry.DairyDesc]:
    'Homogénéisateurs, Machines de remplissage, Remplisseuses rotatives, Cuves, Équipements de refroidissement, Mélangeurs, Trancheuses, etc.',
  [Industry.VegetablesTitle]: 'Fruits / Légumes',
  [Industry.VegetablesDesc]:
    "Trancheuses, Machines à laver, Balances, Machines d'emballage, Détecteurs de métaux, etc.",
  [Industry.MedicinesTitle]: 'Médicaments',
  [Industry.MedicinesDesc]:
    "Presses à comprimés, Machines d'emballage, Flowpack, Thermoformeuses, Lignes robotisées, Pompes, Mélangeurs, etc.",

  [Instructions.Step1Title]: 'Donnez-nous des informations',
  [Instructions.Step1Desc]:
    "Vous remplissez le formulaire en fournissant vos coordonnées, une description complète de l'équipement que vous souhaitez vendre, en indiquant le prix, y compris vidéo/photos.",
  [Instructions.Step2Title]: 'Évaluation rapide',
  [Instructions.Step2Desc]:
    'Nos spécialistes expérimentés évalueront votre équipement et vous contacteront pour vous faire part de notre décision.',
  [Instructions.Step3Title]: 'Affaire conclue!',
  [Instructions.Step3Desc]:
    "Nous nous arrangeons avec vous concernant les méthodes de paiement, les termes et l'expédition. Nous nous occupons généralement de l'expédition, vous n'avez donc pas à vous en inquiéter.",

  [AboutUs.WhoWeAreTitle]: 'Qui nous sommes',
  [AboutUs.WhoWeAreDesc]:
    "Avec plus de deux décennies d'expérience dans l'industrie, Meat Machines est devenu un leader du marché. Notre équipe se compose de plus de 10 professionnels hautement qualifiés, passionnés par leur travail. Nous opérons à partir de quatre grands entrepôts situés dans le sud de la Suède, abritant un impressionnant inventaire de près de 2 000 machines.",
  [AboutUs.WhatWeDoTitle]: 'Ce que nous faisons',
  [AboutUs.WhatWeDoDesc]:
    "Nous sommes spécialisés dans l'achat et la vente de machines de traitement et d'emballage alimentaire d'occasion. Notre vaste inventaire garantit que nous pouvons répondre aux divers besoins de nos clients, quels que soient leurs besoins spécifiques. Chaque machine provient des meilleurs fournisseurs et est maintenue en excellent état grâce à nos solides relations avec diverses entreprises de production alimentaire nordiques.",
  [AboutUs.OurCommitmentTitle]: 'Notre engagement envers la qualité',
  [AboutUs.OurCommitmentDesc]:
    "La qualité est au cœur de tout ce que nous faisons. Votre future machine a beaucoup de chance d'être entre nos mains compétentes et dévouées. Notre équipe d'électriciens et de mécaniciens expérimentés inspecte et entretient méticuleusement chaque machine qui passe par nos portes. Avec des milliers d'unités passées entre leurs mains expertes, notre équipe veille à ce que vous receviez des machines fiables, efficaces et prêtes à fonctionner au mieux de leurs performances.",
  [AboutUs.OurCustomersTitle]: 'Nos clients',
  [AboutUs.OurCustomersDesc]:
    "Notre engagement envers l'excellence nous a valu des milliers de clients satisfaits sur tous les continents. Nous sommes fiers de pouvoir répondre et dépasser les attentes de nos clients, en leur fournissant le meilleur équipement et service sur le marché.",
  [AboutUs.ContinuousTitle]: 'Amélioration continue',
  [AboutUs.ContinuousDesc]:
    "Chez Meat Machines, nous croyons qu'il y a toujours place à l'amélioration. Malgré notre vaste expérience, nous continuons d'apprendre et d'évoluer pour mieux vous servir. Nous améliorons continuellement nos méthodes de recherche, renforçons nos protocoles d'entretien et rationalisons nos processus d'expédition pour garantir des réponses plus rapides et des prix plus compétitifs. Notre objectif est de vous fournir le meilleur équipement et le meilleur service, à chaque fois.",
  [AboutUs.ThankYou]:
    "Merci d'envisager Meat Machines pour vos besoins en équipements de transformation et d'emballage alimentaires. Nous nous réjouissons de travailler avec vous et d'aider votre entreprise à prospérer.",
  [AboutUs.FeelFree]:
    "N'hésitez pas à nous contacter pour toute question ou pour en savoir plus sur notre vaste inventaire.",

  [WhyChooseUs.YearsDesc]: "ans d'expérience",
  [WhyChooseUs.TheBestTitle]: 'Le meilleur',
  [WhyChooseUs.TheBestDesc]: 'Équipement sur le marché',
  [WhyChooseUs.ThousandsTitle]: 'Des milliers',
  [WhyChooseUs.ThousandsDesc]: 'de clients satisfaits à travers le monde',

  [Employee.Hampus]: 'Hampus Wahlgren',
  [Employee.HampusDesc]: "VENTES Suède & à l'étranger",
  [Employee.Hakan]: 'Håkan Wahlgren',
  [Employee.HakanDesc]: 'PDG / APPROVISIONNEMENT',
  [Employee.Erika]: 'Erika Walgreen',
  [Employee.ErikaDesc]: 'ADMIN. GESTION IMMOBILIÈRE',
  [Employee.Eva]: 'Eva Andersson',
  [Employee.EvaDesc]: 'FINANCES',
  [Employee.Catharine]: 'Catharine Wahlgren',
  [Employee.CatharineDesc]: 'FINANCES',
  [Employee.Artem]: 'Artem Bortnik',
  [Employee.ArtemDesc]: 'ASSISTANT COMMERCIAL',

  [ContactUs.Info1]:
    "Si vous avez des questions concernant nos <1>produits ou l'expédition</1>, veuillez contacter <1>Hampus Wahlgren</1> (ou son assistant <1>Artem Bortnik</1>)",
  [ContactUs.Info2]:
    'Si vous avez des questions concernant <1>le paiement</1>, veuillez contacter <1>Eva Andersson</1>',
  [ContactUs.ViewOnMap]: 'Voir sur la carte',
  [ContactUs.WorkingHours]: 'Heures de travail',
  [ContactUs.MonFri]: 'Lun-Ven',

  [Label.Name]: 'Votre nom',
  [Label.Email]: 'Votre email',
  [Label.Phone]: 'Votre numéro de téléphone',
  [Label.ProductName]: 'Nom du produit',
  [Label.Company]: "Nom de l'entreprise",
  [Label.AttachPhotos]: 'Joindre des photos',
  [Label.Country]: 'Choisissez votre pays',
  [Label.Description]: 'Description complète',
  [Label.Message]: 'Message',
  [Label.Price]: 'Prix proposé',
  [Label.Subject]: 'Sujet',

  [Placeholder.Name]: 'Jean Dupont',
  [Placeholder.Email]: 'jean.dupont@example.com',
  [Placeholder.Price]: 'Fixez votre prix de vente',
  [Placeholder.Company]: 'Entrez le nom de votre entreprise',
  [Placeholder.Description]: 'Décrivez votre produit',
  [Placeholder.Message]: 'Écrivez votre message',
  [Placeholder.ProductName]: 'Que vendez-vous ?',
  [Placeholder.SearchProduct]: "Entrez le nom ou l'ID du produit",
  [Placeholder.Search]: 'Chercher...',
  [Placeholder.Subject]: 'Sujet de votre message',
  [Placeholder.SelectCountry]: 'Sélectionnez votre pays',

  [Filter.Category]: 'Catégorie',
  [Filter.Manufacturer]: 'Fabricant',
  [Filter.Industry]: 'Industrie',
  [Filter.Condition]: 'État',
  [Filter.Found]: '{{number}} produits trouvés',
  [Filter.Filters]: 'Filtres',
  [Filter.New]: 'Nouveau',
  [Filter.Used]: 'Occasion',
  [Filter.Reset]: 'Réinitialiser les filtres',

  [Product.Dimensions]: 'Dimensions',
  [Product.Description]: 'Description',

  [Pagination.Next]: 'Suivant',
  [Pagination.Previous]: 'Précédent',
};
