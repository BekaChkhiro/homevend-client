import adminEn from './en/admin.json';
import adminKa from './ka/admin.json';
import adminRu from './ru/admin.json';

export const resources = {
  en: {
    admin: adminEn,
  },
  ka: {
    admin: adminKa,
  },
  ru: {
    admin: adminRu,
  },
};

export type AdminTranslations = typeof adminEn;