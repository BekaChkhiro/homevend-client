import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Building2, MapPin, Square, Bed, DollarSign, Eye, Link, Unlink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { getLanguageUrl } from "@/components/LanguageRoute";

interface UserProperty {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  cityName?: string;
  street: string;
  streetNumber?: string;
  area: number;
  totalPrice: number;
  rooms?: string;
  viewCount: number;
  createdAt: string;
  projectId?: number;
  city?: {
    nameGeorgian: string;
  };
  areaData?: {
    nameKa: string;
  };
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface Project {
  id: number;
  projectName: string;
  city: {
    nameGeorgian: string;
  };
  street: string;
  developer?: {
    id: number;
    fullName: string;
    email: string;
  };
  developerId?: number;
}

export const AdminManageProjectProperties: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const [project, setProject] = useState<Project | null>(null);
  const [allProperties, setAllProperties] = useState<UserProperty[]>([]);
  const [linkedProperties, setLinkedProperties] = useState<UserProperty[]>([]);
  const [selectedToLink, setSelectedToLink] = useState<number[]>([]);
  const [selectedToUnlink, setSelectedToUnlink] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchProperties();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Admin fetching properties...');
      
      // Get developer ID from project data first
      let developerId = null;
      if (project && project.developerId) {
        developerId = project.developerId;
      } else {
        // If we don't have project data yet, try to fetch it first
        const projectResponse = await fetch(`/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          developerId = projectData.developer?.id || projectData.developerId;
        }
      }
      
      console.log('Filtering properties for developer ID:', developerId);
      
      // Build URL with developerId parameter if available
      const queryParams = new URLSearchParams();
      if (developerId) {
        queryParams.set('developerId', developerId.toString());
      }
      const url = `/api/admin/properties${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Fetching from URL:', url);
      
      // Try multiple endpoints to get properties for the specific developer
      let response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Admin properties response status:', response.status);
      
      // If admin endpoint doesn't exist, try regular properties endpoint
      if (response.status === 404 || !response.ok) {
        console.log('Admin endpoint failed, trying regular properties endpoint...');
        const fallbackUrl = `/api/properties${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        console.log('Trying fallback URL:', fallbackUrl);
        response = await fetch(fallbackUrl, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Regular properties response status:', response.status);
      }
      
      if (response.ok) {
        const result = await response.json();
        console.log('Properties API Response:', result);
        
        // Handle multiple possible response formats
        let data = [];
        if (result.success && Array.isArray(result.data)) {
          data = result.data;
        } else if (result.properties && Array.isArray(result.properties)) {
          data = result.properties;
        } else if (Array.isArray(result)) {
          data = result;
        } else {
          console.error('Unexpected response format:', result);
          data = [];
        }
        
        console.log('Extracted properties data:', data);
        console.log('Project ID from params:', projectId);
        
        if (data.length > 0) {
          const projectIdNum = parseInt(projectId!);
          const linked = data.filter((property: UserProperty) => property.projectId === projectIdNum);
          const unlinked = data.filter((property: UserProperty) => !property.projectId || property.projectId !== projectIdNum);
          
          console.log('Linked properties:', linked);
          console.log('Unlinked properties:', unlinked);
          
          setLinkedProperties(linked);
          setAllProperties(unlinked);
        } else {
          console.log('No properties found');
          setLinkedProperties([]);
          setAllProperties([]);
        }
      } else {
        const errorText = await response.text();
        console.error('API Error - Status:', response.status);
        console.error('API Error - Body:', errorText);
        
        // Show fallback mock data for testing
        const mockProperties: UserProperty[] = [
          {
            id: 999,
            title: t('manageProperties.mockData.testListing'),
            propertyType: "apartment",
            dealType: "sale",
            cityName: t('manageProperties.mockData.city'),
            street: t('manageProperties.mockData.street1'),
            area: 85,
            totalPrice: 150000,
            rooms: "3",
            viewCount: 0,
            createdAt: new Date().toISOString(),
            projectId: undefined,
            user: {
              id: 1,
              fullName: t('manageProperties.mockData.testUser'),
              email: "test@example.com"
            }
          }
        ];
        
        setLinkedProperties([]);
        setAllProperties(mockProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      
      // Show mock data on network error  
      const mockProperties: UserProperty[] = [
        {
          id: 998,
          title: t('manageProperties.mockData.mockListing'),
          propertyType: "apartment", 
          dealType: "sale",
          cityName: t('manageProperties.mockData.city'),
          street: t('manageProperties.mockData.street2'),
          area: 75,
          totalPrice: 120000,
          rooms: "2",
          viewCount: 0,
          createdAt: new Date().toISOString(),
          projectId: undefined,
          user: {
            id: 1,
            fullName: t('manageProperties.mockData.mockUser'),
            email: "mock@example.com"
          }
        }
      ];
      
      setLinkedProperties([]);
      setAllProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSelection = (propertyId: number, selected: boolean) => {
    if (selected) {
      setSelectedToLink(prev => [...prev, propertyId]);
    } else {
      setSelectedToLink(prev => prev.filter(id => id !== propertyId));
    }
  };

  const handleUnlinkSelection = (propertyId: number, selected: boolean) => {
    if (selected) {
      setSelectedToUnlink(prev => [...prev, propertyId]);
    } else {
      setSelectedToUnlink(prev => prev.filter(id => id !== propertyId));
    }
  };

  const handleSaveChanges = async () => {
    if (selectedToLink.length === 0 && selectedToUnlink.length === 0) {
      toast({
        title: t('common.info'),
        description: t('manageProperties.messages.noChanges'),
      });
      return;
    }

    setSaving(true);
    try {
      // Link selected properties
      await Promise.all(selectedToLink.map(async (propertyId) => {
        const projectIdNum = parseInt(projectId!);
        console.log('Admin linking property:', propertyId, 'to project:', projectIdNum);
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ projectId: projectIdNum }),
        });
        
        if (!response.ok) {
          // Fallback to regular properties endpoint
          const fallbackResponse = await fetch(`/api/properties/${propertyId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ projectId: projectIdNum }),
          });
          
          if (!fallbackResponse.ok) {
            throw new Error(`Failed to link property ${propertyId}`);
          }
        }
      }));

      // Unlink selected properties
      await Promise.all(selectedToUnlink.map(async (propertyId) => {
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ projectId: null }),
        });
        
        if (!response.ok) {
          // Fallback to regular properties endpoint
          const fallbackResponse = await fetch(`/api/properties/${propertyId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ projectId: null }),
          });
          
          if (!fallbackResponse.ok) {
            throw new Error(`Failed to unlink property ${propertyId}`);
          }
        }
      }));

      toast({
        title: t('common.success'),
        description: t('manageProperties.messages.changesSaved', { linked: selectedToLink.length, unlinked: selectedToUnlink.length }),
      });

      // Reset selections and refresh data
      setSelectedToLink([]);
      setSelectedToUnlink([]);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property links:', error);
      toast({
        title: t('common.error'),
        description: t('manageProperties.messages.errorSaving'),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderPropertyCard = (property: UserProperty, isLinked: boolean) => (
    <div 
      key={property.id} 
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isLinked 
          ? (selectedToUnlink.includes(property.id) 
              ? 'border-red-300 bg-red-50 ring-2 ring-red-200' 
              : 'border-green-300 bg-green-50')
          : (selectedToLink.includes(property.id) 
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
              : 'border-gray-200 hover:border-gray-300')
      }`}
      onClick={() => 
        isLinked 
          ? handleUnlinkSelection(property.id, !selectedToUnlink.includes(property.id))
          : handleLinkSelection(property.id, !selectedToLink.includes(property.id))
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={isLinked ? selectedToUnlink.includes(property.id) : selectedToLink.includes(property.id)}
              readOnly
              className="pointer-events-none"
            />
            <h4 className="font-semibold text-sm line-clamp-2">{property.title}</h4>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {property.city?.nameGeorgian || property.cityName || 'Unknown City'}
                {property.areaData && `, ${property.areaData.nameKa}`}
                , {property.street}
                {property.streetNumber && ` ${property.streetNumber}`}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.area} {t('common.squareMeters')}</span>
              </div>
              {property.rooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.rooms} {t('common.rooms')}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>
                  {new Intl.NumberFormat('ka-GE', {
                    style: 'currency',
                    currency: 'GEL',
                    minimumFractionDigits: 0
                  }).format(property.totalPrice)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {t(`listings.propertyTypes.${property.propertyType}`, { defaultValue: property.propertyType })}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {t(`listings.dealTypes.${property.dealType}`, { defaultValue: property.dealType })}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="h-3 w-3" />
                  <span>{property.viewCount}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(property.createdAt).toLocaleDateString('ka-GE')}
                </span>
              </div>
            </div>

            {/* Show property owner for admin */}
            {property.user && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                {t('manageProperties.labels.owner')}: {property.user.fullName} ({property.user.email})
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto w-16 h-16 opacity-50 text-gray-400 mb-4" />
        <p>{t('manageProperties.messages.adminOnly')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(getLanguageUrl('admin/projects', i18n.language))}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('manageProperties.title')}</h1>
          {project && (
            <p className="text-gray-600">{t('manageProperties.labels.project')}: {project.projectName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Properties to Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              {t('manageProperties.labels.availableToLink')}
            </CardTitle>
            <CardDescription>
              {t('manageProperties.descriptions.selectToLink')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('manageProperties.messages.noAvailable')}</p>
                <p className="text-sm mt-2">{t('manageProperties.messages.allLinked')}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedToLink.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {t('manageProperties.messages.selectedToLink', { count: selectedToLink.length })}
                    </p>
                  </div>
                )}
                {allProperties.map(property => renderPropertyCard(property, false))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currently Linked Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlink className="h-5 w-5" />
              {t('manageProperties.labels.linkedProperties', { count: linkedProperties.length })}
            </CardTitle>
            <CardDescription>
              {t('manageProperties.descriptions.selectToUnlink')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {linkedProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('manageProperties.messages.noLinked')}</p>
                <p className="text-sm mt-2">{t('manageProperties.messages.noneLinked')}</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedToUnlink.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      {t('manageProperties.messages.selectedToUnlink', { count: selectedToUnlink.length })}
                    </p>
                  </div>
                )}
                {linkedProperties.map(property => renderPropertyCard(property, true))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {(selectedToLink.length > 0 || selectedToUnlink.length > 0) && (
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedToLink([]);
              setSelectedToUnlink([]);
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveChanges} disabled={saving}>
            {saving ? t('common.saving') : t('manageProperties.buttons.saveChanges')}
          </Button>
        </div>
      )}
    </div>
  );
};