import { MultiLanguageString } from './IProduct';

export interface IEmployee {
  _id: string;
  name: MultiLanguageString;
  description: MultiLanguageString;
  phone: string;
  email: string;
  additionalInfo: string;
}
