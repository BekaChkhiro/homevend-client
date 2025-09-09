import adminEn from './en/admin.json';
import adminKa from './ka/admin.json';
import adminRu from './ru/admin.json';
import userDashboardEn from './en/userDashboard.json';
import userDashboardKa from './ka/userDashboard.json';
import userDashboardRu from './ru/userDashboard.json';
import commonEn from './en/common.json';
import commonKa from './ka/common.json';
import commonRu from './ru/common.json';
import authEn from './en/auth.json';
import authKa from './ka/auth.json';
import authRu from './ru/auth.json';
import propertyCardEn from './en/propertyCard.json';
import propertyCardKa from './ka/propertyCard.json';
import propertyCardRu from './ru/propertyCard.json';
import aboutUsEn from './en/aboutUs.json';
import aboutUsKa from './ka/aboutUs.json';
import aboutUsRu from './ru/aboutUs.json';
import servicesEn from './en/services.json';
import servicesKa from './ka/services.json';
import servicesRu from './ru/services.json';
import homeEn from './en/home.json';
import homeKa from './ka/home.json';
import homeRu from './ru/home.json';
import advertisementsEn from './en/advertisements.json';
import advertisementsKa from './ka/advertisements.json';
import advertisementsRu from './ru/advertisements.json';
import footerEn from './en/footer.json';
import footerKa from './ka/footer.json';
import footerRu from './ru/footer.json';
import districtCarouselEn from './en/districtCarousel.json';
import districtCarouselKa from './ka/districtCarousel.json';
import districtCarouselRu from './ru/districtCarousel.json';

export const resources = {
  en: {
    admin: adminEn,
    userDashboard: userDashboardEn,
    common: commonEn,
    auth: authEn,
    propertyCard: propertyCardEn,
    aboutUs: aboutUsEn,
    services: servicesEn,
    home: homeEn,
    advertisements: advertisementsEn,
    footer: footerEn,
    districtCarousel: districtCarouselEn,
  },
  ka: {
    admin: adminKa,
    userDashboard: userDashboardKa,
    common: commonKa,
    auth: authKa,
    propertyCard: propertyCardKa,
    aboutUs: aboutUsKa,
    services: servicesKa,
    home: homeKa,
    advertisements: advertisementsKa,
    footer: footerKa,
    districtCarousel: districtCarouselKa,
  },
  ru: {
    admin: adminRu,
    userDashboard: userDashboardRu,
    common: commonRu,
    auth: authRu,
    propertyCard: propertyCardRu,
    aboutUs: aboutUsRu,
    services: servicesRu,
    home: homeRu,
    advertisements: advertisementsRu,
    footer: footerRu,
    districtCarousel: districtCarouselRu,
  },
};

export type AdminTranslations = typeof adminEn;
export type UserDashboardTranslations = typeof userDashboardEn;
export type CommonTranslations = typeof commonEn;
export type AuthTranslations = typeof authEn;
export type PropertyCardTranslations = typeof propertyCardEn;
export type AboutUsTranslations = typeof aboutUsEn;
export type ServicesTranslations = typeof servicesEn;
export type HomeTranslations = typeof homeEn;
export type AdvertisementsTranslations = typeof advertisementsEn;
export type FooterTranslations = typeof footerEn;
export type DistrictCarouselTranslations = typeof districtCarouselEn;
