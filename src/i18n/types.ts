import { AdminTranslations } from './resources';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'admin';
    resources: {
      admin: AdminTranslations;
    };
  }
}