interface Product {
  name: string;
  idNumber: string;
  photo: string;
}
export interface IRequestQuoteData {
  name: string;
  email: string;
  phone: string;
  countryPhone: string;
  country: string;
  company: string;
  products: Product[];
}
