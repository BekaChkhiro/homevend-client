import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UniversalImageUpload } from '@/components/UniversalImageUpload';
import { AvatarUpload } from '@/components/AvatarUpload';
import { EntityType } from '@/hooks/useUniversalImageUpload';
import { useTranslation } from 'react-i18next';

export const ImageUploadDemo: React.FC = () => {
  const { t } = useTranslation(['imageUpload', 'common']);
  const [propertyId, setPropertyId] = useState(1);
  const [userId, setUserId] = useState(1);
  const [agencyId, setAgencyId] = useState(1);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('demo.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('demo.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="property" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="property">{t('demo.tabs.propertyGallery')}</TabsTrigger>
          <TabsTrigger value="user">{t('demo.tabs.userAvatar')}</TabsTrigger>
          <TabsTrigger value="agency">{t('demo.tabs.agencyLogo')}</TabsTrigger>
          <TabsTrigger value="project">{t('demo.tabs.projectGallery')}</TabsTrigger>
        </TabsList>

        {/* Property Gallery Upload */}
        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('demo.property.title')}</CardTitle>
              <CardDescription>
                {t('demo.property.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="propertyId">{t('demo.property.propertyId')}</Label>
                <Input
                  id="propertyId"
                  type="number"
                  value={propertyId}
                  onChange={(e) => setPropertyId(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              <UniversalImageUpload
                entityType="property"
                entityId={propertyId}
                purpose="property_gallery"
                maxFiles={15}
                maxSize={15}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                showPrimary={true}
                onImagesChange={(images) => {
                  console.log('Property images updated:', images);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Avatar Upload */}
        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('demo.user.title')}</CardTitle>
              <CardDescription>
                {t('demo.user.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="userId">{t('demo.user.userId')}</Label>
                <Input
                  id="userId"
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              
              <div className="flex items-center space-x-8">
                {/* Avatar Upload Component */}
                <div className="space-y-2">
                  <Label>{t('demo.user.avatarComponent')}</Label>
                  <AvatarUpload
                    userId={userId}
                    size="xl"
                    onAvatarChange={(url) => {
                      console.log('Avatar updated:', url);
                    }}
                  />
                </div>

                {/* Or Universal Upload for User Avatar */}
                <div className="flex-1">
                  <Label>{t('demo.user.universalUpload')}</Label>
                  <UniversalImageUpload
                    entityType="user"
                    entityId={userId}
                    purpose="user_avatar"
                    maxFiles={1}
                    maxSize={5}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    showPrimary={false}
                    onImagesChange={(images) => {
                      console.log('User avatar updated:', images);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agency Logo Upload */}
        <TabsContent value="agency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('demo.agency.title')}</CardTitle>
              <CardDescription>
                {t('demo.agency.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="agencyId">{t('demo.agency.agencyId')}</Label>
                <Input
                  id="agencyId"
                  type="number"
                  value={agencyId}
                  onChange={(e) => setAgencyId(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              <UniversalImageUpload
                entityType="agency"
                entityId={agencyId}
                purpose="agency_logo"
                maxFiles={1}
                maxSize={2}
                acceptedTypes={['image/jpeg', 'image/png', 'image/svg+xml']}
                showPrimary={false}
                onImagesChange={(images) => {
                  console.log('Agency logo updated:', images);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Project Gallery Upload */}
        <TabsContent value="project" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('demo.project.title')}</CardTitle>
              <CardDescription>
                {t('demo.project.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label htmlFor="projectId">{t('demo.project.projectId')}</Label>
                <Input
                  id="projectId"
                  type="number"
                  value={1}
                  className="w-32"
                />
              </div>
              <UniversalImageUpload
                entityType="project"
                entityId={1}
                purpose="project_gallery"
                maxFiles={20}
                maxSize={10}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                showPrimary={true}
                onImagesChange={(images) => {
                  console.log('Project images updated:', images);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('demo.apiTest.title')}</CardTitle>
          <CardDescription>
            {t('demo.apiTest.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(`http://localhost:5000/api/upload/property/1/images`);
                  const data = await response.json();
                  console.log('Property images:', data);
                } catch (error) {
                  console.error('API test failed:', error);
                }
              }}
            >
              {t('demo.apiTest.testPropertyImages')}
            </Button>
            
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(`http://localhost:5000/api/upload/user/1/images`);
                  const data = await response.json();
                  console.log('User images:', data);
                } catch (error) {
                  console.error('API test failed:', error);
                }
              }}
            >
              {t('demo.apiTest.testUserImages')}
            </Button>
            
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(`http://localhost:5000/api/upload/agency/1/images`);
                  const data = await response.json();
                  console.log('Agency images:', data);
                } catch (error) {
                  console.error('API test failed:', error);
                }
              }}
            >
              {t('demo.apiTest.testAgencyImages')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};