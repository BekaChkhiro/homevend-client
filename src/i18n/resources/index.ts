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
import propertyDetailEn from './en/propertyDetail.json';
import propertyDetailKa from './ka/propertyDetail.json';
import propertyDetailRu from './ru/propertyDetail.json';
import propertiesEn from './en/properties.json';
import propertiesKa from './ka/properties.json';
import propertiesRu from './ru/properties.json';
import adBannerEn from './en/adBanner.json';
import adBannerKa from './ka/adBanner.json';
import adBannerRu from './ru/adBanner.json';
import homeEn from './en/home.json';
import homeKa from './ka/home.json';
import homeRu from './ru/home.json';
import agenciesEn from './en/agencies.json';
import agenciesKa from './ka/agencies.json';
import agenciesRu from './ru/agencies.json';
import projectFormEn from './en/projectForm.json';
import projectFormKa from './ka/projectForm.json';
import projectFormRu from './ru/projectForm.json';

export const resources = {
  en: {
    admin: adminEn,
    userDashboard: userDashboardEn,
    common: commonEn,
    auth: authEn,
    propertyCard: propertyCardEn,
    aboutUs: aboutUsEn,
    propertyDetail: propertyDetailEn,
    properties: propertiesEn,
    adBanner: adBannerEn,
    home: homeEn,
    agencies: agenciesEn,
    projectForm: projectFormEn,
  },
  ka: {
    admin: adminKa,
    userDashboard: userDashboardKa,
    common: commonKa,
    auth: authKa,
    propertyCard: propertyCardKa,
    aboutUs: aboutUsKa,
    propertyDetail: propertyDetailKa,
    properties: propertiesKa,
    adBanner: adBannerKa,
    home: homeKa,
    agencies: agenciesKa,
    projectForm: projectFormKa,
  },
  ru: {
    admin: adminRu,
    userDashboard: userDashboardRu,
    common: commonRu,
    auth: authRu,
    propertyCard: propertyCardRu,
    aboutUs: aboutUsRu,
    propertyDetail: propertyDetailRu,
    properties: propertiesRu,
    adBanner: adBannerRu,
    home: homeRu,
    agencies: agenciesRu,
    projectForm: projectFormRu,
  },
};

export type AdminTranslations = typeof adminEn;
export type UserDashboardTranslations = typeof userDashboardEn;
export type CommonTranslations = typeof commonEn;
export type AuthTranslations = typeof authEn;
export type PropertyCardTranslations = typeof propertyCardEn;
export type AboutUsTranslations = typeof aboutUsEn;
export type PropertyDetailTranslations = typeof propertyDetailEn;
export type PropertiesTranslations = typeof propertiesEn;
export type AdBannerTranslations = typeof adBannerEn;
export type HomeTranslations = typeof homeEn;
export type AgenciesTranslations = typeof agenciesEn;
export type ProjectFormTranslations = typeof projectFormEn;
