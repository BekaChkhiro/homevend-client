import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Building2, MapPin, Square, Bed, DollarSign, Eye, Link, Unlink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserProperty {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  city: string;
  street: string;
  streetNumber?: string;
  area: number;
  totalPrice: number;
  rooms?: string;
  viewCount: number;
  createdAt: string;
  projectId?: number;
  cityData?: {
    nameGeorgian: string;
  };
  areaData?: {
    nameKa: string;
  };
}

interface Project {
  id: number;
  projectName: string;
  city: {
    nameGeorgian: string;
  };
  street: string;
}

export const ManageProjectProperties: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [userProperties, setUserProperties] = useState<UserProperty[]>([]);
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
      const response = await fetch('/api/properties/my-properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        
        // Handle both direct array and { success: true, data: [] } format
        const data = result.success ? result.data : result;
        console.log('User properties data:', data);
        console.log('Project ID from params:', projectId);
        
        const projectIdNum = parseInt(projectId!);
        const linked = data.filter((property: UserProperty) => property.projectId === projectIdNum);
        const unlinked = data.filter((property: UserProperty) => !property.projectId || property.projectId !== projectIdNum);
        
        console.log('Linked properties:', linked);
        console.log('Unlinked properties:', unlinked);
        
        setLinkedProperties(linked);
        setUserProperties(unlinked);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
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
        title: "შეტყობინება",
        description: "არანაირი ცვლილება არ არის შერჩეული",
      });
      return;
    }

    setSaving(true);
    try {
      // Link selected properties
      await Promise.all(selectedToLink.map(async (propertyId) => {
        const projectIdNum = parseInt(projectId!);
        console.log('Linking property:', propertyId, 'to project:', projectIdNum);
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ projectId: projectIdNum }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to link property ${propertyId}`);
        }
      }));

      // Unlink selected properties
      await Promise.all(selectedToUnlink.map(async (propertyId) => {
        const response = await fetch(`/api/properties/${propertyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ projectId: null }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to unlink property ${propertyId}`);
        }
      }));

      toast({
        title: "წარმატება",
        description: `${selectedToLink.length} განცხადება მიმაგრდა${selectedToUnlink.length > 0 ? ` და ${selectedToUnlink.length} მოხსნილია` : ''}`,
      });

      // Reset selections and refresh data
      setSelectedToLink([]);
      setSelectedToUnlink([]);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property links:', error);
      toast({
        title: "შეცდომა",
        description: "ცვლილებების შენახვისას მოხდა შეცდომა",
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
                {property.cityData?.nameGeorgian || property.city}
                {property.areaData && `, ${property.areaData.nameKa}`}
                , {property.street}
                {property.streetNumber && ` ${property.streetNumber}`}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{property.area} მ²</span>
              </div>
              {property.rooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.rooms} ოთახი</span>
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
                  {property.propertyType === 'apartment' ? 'ბინა' :
                   property.propertyType === 'house' ? 'სახლი' :
                   property.propertyType === 'commercial' ? 'კომერციული' :
                   property.propertyType}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {property.dealType === 'sale' ? 'იყიდება' :
                   property.dealType === 'rent' ? 'ქირავდება' :
                   property.dealType === 'daily' ? 'დღიური' :
                   property.dealType}
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
          </div>
        </div>
      </div>
    </div>
  );

  if (user?.role !== 'developer') {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto w-16 h-16 opacity-50 text-gray-400 mb-4" />
        <p>მხოლოდ დეველოპერებს შეუძლიათ განცხადებების მართვა</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>მონაცემების ჩატვირთვა...</span>
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
          onClick={() => navigate('/dashboard/my-projects')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან
        </Button>
        <div>
          <h1 className="text-2xl font-bold">განცხადების მართვა</h1>
          {project && (
            <p className="text-gray-600">პროექტი: {project.projectName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Properties to Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              მიმაგრების ხელმისაწვდომი განცხადებები
            </CardTitle>
            <CardDescription>
              აირჩიეთ განცხადებები რომლებიც გსურთ ამ პროექტთან მიამაგროთ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>არ არის ხელმისაწვდომი განცხადებები მიმაგრებისთვის</p>
                <p className="text-sm mt-2">ყველა თქვენი განცხადება უკვე მიმაგრებულია პროექტებზე</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedToLink.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{selectedToLink.length}</strong> განცხადება არჩეულია მიმაგრებისთვის
                    </p>
                  </div>
                )}
                {userProperties.map(property => renderPropertyCard(property, false))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currently Linked Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlink className="h-5 w-5" />
              მიმაგრებული განცხადებები ({linkedProperties.length})
            </CardTitle>
            <CardDescription>
              აირჩიეთ განცხადებები რომლებიც გსურთ ამ პროექტისგან მოხსნათ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {linkedProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>არ არის მიმაგრებული განცხადებები</p>
                <p className="text-sm mt-2">ამ პროექტზე ჯერ არ არის მიმაგრებული განცხადებები</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedToUnlink.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>{selectedToUnlink.length}</strong> განცხადება არჩეულია მოსახსნელად
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
            გაუქმება
          </Button>
          <Button onClick={handleSaveChanges} disabled={saving}>
            {saving ? "შენახვა..." : "ცვლილებების შენახვა"}
          </Button>
        </div>
      )}
    </div>
  );
};