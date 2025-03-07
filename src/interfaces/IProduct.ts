import type { LanguageKeys } from '@enums/languageKeys';

export type MultiLanguageString = {
  [key in LanguageKeys]: string;
};

export interface IProduct {
  _id: string;
  name: MultiLanguageString | string;
  idNumber: string;
  description: MultiLanguageString;
  dimensions: string;
  photos: string[];
  video: string;
  category: MultiLanguageString;
  manufacturer: string;
  industries: MultiLanguageString[];
  condition: 'used' | 'new';
  createdAt: Date;
  deletionDate: Date | null;
}
