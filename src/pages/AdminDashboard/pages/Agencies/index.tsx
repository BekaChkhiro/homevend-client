import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Loader2, Eye, Edit, Trash2, MapPin, Calendar, User, Phone, Mail, Building } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Agency {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  totalListings: number;
  activeListings: number;
  totalAgents: number;
  owner: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  logo?: string;
}

const AdminAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/agencies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agencies: ${response.status}`);
      }

      const data = await response.json();
      setAgencies(data.data || []);
    } catch (error: any) {
      console.error('Error fetching agencies:', error);
      toast({
        title: "შეცდომა",
        description: "სააგენტოების ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (agencyId: number) => {
    try {
      const response = await fetch(`/api/admin/agencies/${agencyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete agency: ${response.status}`);
      }

      setAgencies(agencies.filter(a => a.id !== agencyId));
      
      toast({
        title: "წარმატება",
        description: "სააგენტო წარმატებით წაიშალა",
      });
    } catch (error: any) {
      toast({
        title: "შეცდომა",
        description: "სააგენტოს წაშლისას მოხდა შეცდომა",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (agencyId: number, newStatus: string) => {
    try {
      const updateData = {
        isActive: newStatus === 'active',
        isVerified: newStatus === 'active' ? true : undefined
      };

      const response = await fetch(`/api/admin/agencies/${agencyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update agency status: ${response.status}`);
      }

      // Update local state
      setAgencies(agencies.map(a => 
        a.id === agencyId 
          ? { ...a, status: newStatus as 'active' | 'inactive' | 'pending' }
          : a
      ));
      
      toast({
        title: "წარმატება",
        description: `სააგენტოს სტატუსი შეიცვალა: ${getStatusText(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "შეცდომა",
        description: "სააგენტოს სტატუსის შეცვლისას მოხდა შეცდომა",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "აქტიური";
      case "pending": return "განხილვაში";
      case "inactive": return "არააქტიური";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">სააგენტოების მართვა</h1>
          <p className="text-gray-600">ყველა სააგენტოს ნახვა და მართვა</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>სააგენტოების ჩატვირთვა...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">სააგენტოების მართვა</h1>
        <p className="text-gray-600">ყველა სააგენტოს ნახვა და მართვა ({agencies.length} სააგენტო)</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>სააგენტოების სია</CardTitle>
              <CardDescription>ყველა სააგენტოს ნახვა, დამტკიცება და მართვა</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                ფილტრი
              </Button>
              <Button size="sm" onClick={fetchAgencies}>
                <Plus className="h-4 w-4 mr-2" />
                განახლება
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agencies.map((agency) => (
              <Card key={agency.id} className="border hover:shadow-sm transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Logo placeholder */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate pr-4">
                          {agency.name}
                        </h3>
                        <Badge className={`${getStatusColor(agency.status)} px-2 py-1`}>
                          {getStatusText(agency.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">{agency.address}</span>
                        <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">{agency.phone}</span>
                        <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{agency.email}</span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">
                          მფლობელი: {agency.owner.name}
                        </span>
                        <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">
                          {agency.totalAgents} აგენტი, {agency.activeListings} აქტიური განცხადება
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>რეგისტრაცია: {formatDate(agency.createdAt)}</span>
                        </div>
                        <div>
                          სულ {agency.totalListings} განცხადება
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => navigate(`/agencies/${agency.id}`)}
                        title="ნახვა"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">ნახვა</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => {
                          // Simple inline editing by toggling agency status
                          const newStatus = agency.status === 'active' ? 'inactive' : 'active';
                          handleStatusChange(agency.id, newStatus);
                        }}
                        title="სტატუსის შეცვლა"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-xs">სტატუსი</span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="წაშლა"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">წაშლა</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>სააგენტოს წაშლა</AlertDialogTitle>
                            <AlertDialogDescription>
                              დარწმუნებული ხართ, რომ გსურთ ამ სააგენტოს წაშლა? ეს მოქმედება შეუქცევადია.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(agency.id)} 
                              className="bg-red-600 hover:bg-red-700"
                            >
                              წაშლა
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {agencies.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">სააგენტოები ვერ მოიძებნა</p>
              <Button onClick={fetchAgencies}>
                <Plus className="h-4 w-4 mr-2" />
                განახლება
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAgencies;