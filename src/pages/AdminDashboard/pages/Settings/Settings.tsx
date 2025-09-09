import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Users, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation('admin');
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settings.title')}</h1>
        <p className="text-gray-600">{t('settings.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.configuration.title')}</CardTitle>
          <CardDescription>{t('settings.configuration.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <SettingsIcon className="h-4 w-4 mr-2" />
              {t('settings.buttons.general')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              {t('settings.buttons.users')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              {t('settings.buttons.listings')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;