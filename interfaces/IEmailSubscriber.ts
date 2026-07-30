export enum FormSubmissionSource {
  ContactUs = 'contact_us',
  SellToUs = 'sell_to_us',
  RequestQuote = 'request_quote',
}

export interface IEmailSubscriber {
  _id: string;
  name: string;
  email: string;
  marketingConsent: boolean;
  source: FormSubmissionSource;
  createdAt: string;
  updatedAt: string;
}
