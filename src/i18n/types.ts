import { AdminTranslations, UserDashboardTranslations, CommonTranslations, AuthTranslations, PropertyCardTranslations, AboutUsTranslations, PropertyDetailTranslations,ServicesTranslations,HomeTranslations, PropertiesTranslations,AdvertisementsTranslations, AdBannerTranslations,FooterTranslations, DistrictCarouselTranslations,PriceStatisticsTranslations,HomeTranslations, AgenciesTranslations, ProjectFormTranslations } from './resources';

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
      services: ServicesTranslations;
      home: HomeTranslations;
      advertisements: AdvertisementsTranslations;
      footer: FooterTranslations;
      districtCarousel: DistrictCarouselTranslations;
      priceStatistics: PriceStatisticsTranslations;
    };
  }
}
