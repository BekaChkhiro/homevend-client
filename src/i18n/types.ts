import { AdminTranslations, UserDashboardTranslations, CommonTranslations, AuthTranslations, PropertyCardTranslations, AboutUsTranslations, PropertyDetailTranslations, PropertiesTranslations, AdBannerTranslations, HomeTranslations, AgenciesTranslations, ProjectFormTranslations } from './resources';

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
      propertyDetail: PropertyDetailTranslations;
      properties: PropertiesTranslations;
      adBanner: AdBannerTranslations;
      home: HomeTranslations;
      agencies: AgenciesTranslations;
      projectForm: ProjectFormTranslations;
    };
  }
}
