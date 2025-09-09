import { AdminTranslations, UserDashboardTranslations, CommonTranslations, AuthTranslations, PropertyCardTranslations, AboutUsTranslations, ServicesTranslations, HomeTranslations, AdvertisementsTranslations, FooterTranslations, DistrictCarouselTranslations } from './resources';

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
      services: ServicesTranslations;
      home: HomeTranslations;
      advertisements: AdvertisementsTranslations;
      footer: FooterTranslations;
      districtCarousel: DistrictCarouselTranslations;
    };
  }
}
