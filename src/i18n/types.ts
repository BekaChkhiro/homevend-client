import { AdminTranslations, UserDashboardTranslations, CommonTranslations, AuthTranslations, PropertyCardTranslations, AboutUsTranslations } from './resources';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      admin: AdminTranslations;
      userDashboard: UserDashboardTranslations;
      common: CommonTranslations;
      auth: AuthTranslations;
      propertyCard: PropertyCardTranslations;
      aboutUs: AboutUsTranslations;
    };
  }
}
