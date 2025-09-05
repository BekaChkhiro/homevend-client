import adminEn from './en/admin.json';
import adminKa from './ka/admin.json';
import adminRu from './ru/admin.json';
import userDashboardEn from './en/userDashboard.json';
import userDashboardKa from './ka/userDashboard.json';
import userDashboardRu from './ru/userDashboard.json';

export const resources = {
  en: {
    admin: adminEn,
    userDashboard: userDashboardEn,
  },
  ka: {
    admin: adminKa,
    userDashboard: userDashboardKa,
  },
  ru: {
    admin: adminRu,
    userDashboard: userDashboardRu,
  },
};

export type AdminTranslations = typeof adminEn;
export type UserDashboardTranslations = typeof userDashboardEn;