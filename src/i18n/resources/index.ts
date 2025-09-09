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

export const resources = {
  en: {
    admin: adminEn,
    userDashboard: userDashboardEn,
    common: commonEn,
    auth: authEn,
    propertyCard: propertyCardEn,
    aboutUs: aboutUsEn,
    services: servicesEn,
  },
  ka: {
    admin: adminKa,
    userDashboard: userDashboardKa,
    common: commonKa,
    auth: authKa,
    propertyCard: propertyCardKa,
    aboutUs: aboutUsKa,
    services: servicesKa,
  },
  ru: {
    admin: adminRu,
    userDashboard: userDashboardRu,
    common: commonRu,
    auth: authRu,
    propertyCard: propertyCardRu,
    aboutUs: aboutUsRu,
    services: servicesRu,
  },
};

export type AdminTranslations = typeof adminEn;
export type UserDashboardTranslations = typeof userDashboardEn;
export type CommonTranslations = typeof commonEn;
export type AuthTranslations = typeof authEn;
export type PropertyCardTranslations = typeof propertyCardEn;
export type AboutUsTranslations = typeof aboutUsEn;
export type ServicesTranslations = typeof servicesEn;
