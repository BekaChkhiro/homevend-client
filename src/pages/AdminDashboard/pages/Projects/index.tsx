import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Loader2, Eye, Edit, Trash2, MapPin, Calendar, User, Building, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  status: 'active' | 'completed' | 'planned' | 'inactive' | string;
  totalUnits: number;
  soldUnits: number;
  startDate: string;
  completionDate?: string;
  minPrice: number;
  maxPrice: number;
  developer: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  images: string[];
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      
      console.log('Fetching projects from /api/admin/projects...');
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Projects API response status:', response.status);
      console.log('Projects API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('Projects full response:', result);
        
        // Handle admin API response format
        let projectsData = [];
        
        if (result.success && result.data && result.data.projects) {
          projectsData = result.data.projects;
        } else if (result.success && result.data && Array.isArray(result.data)) {
          projectsData = result.data;
        } else if (result.projects) {
          projectsData = result.projects;
        } else if (Array.isArray(result)) {
          projectsData = result;
        }
        
        console.log('Extracted projects data:', projectsData);
        console.log('Projects data type:', typeof projectsData, 'Is array:', Array.isArray(projectsData));
        
        if (Array.isArray(projectsData) && projectsData.length > 0) {
          console.log('First project sample:', projectsData[0]);
          
          // Transform API data to match our interface
          const transformedProjects = projectsData.map((proj: any) => ({
            id: proj.id,
            title: proj.projectName || proj.title || `პროექტი #${proj.id}`,
            description: proj.description || "",
            location: `${proj.street || ""} ${proj.cityData?.nameGeorgian || proj.city || ""}`.trim(),
            status: proj.status || "active",
            totalUnits: proj.totalApartments || proj.totalUnits || 0,
            soldUnits: proj.soldUnits || 0,
            startDate: proj.createdAt || new Date().toISOString(),
            completionDate: proj.deliveryDate,
            minPrice: proj.minPrice || 0,
            maxPrice: proj.maxPrice || 0,
            developer: {
              id: proj.developer?.id || proj.user?.id || proj.developerId || 0,
              name: proj.developer?.fullName || proj.user?.fullName || proj.developerName || "უცნობი დეველოპერი",
              email: proj.developer?.email || proj.user?.email || proj.developerEmail || ""
            },
            createdAt: proj.createdAt || new Date().toISOString(),
            images: proj.images || []
          }));
          
          console.log('Transformed projects:', transformedProjects);
          setProjects(transformedProjects);
        } else {
          console.log('No projects found or invalid data format');
          setProjects([]);
          
          // Show fallback mock data for testing
          const mockProjects: Project[] = [
            {
              id: 999,
              title: "ტესტ პროექტი (API არ მუშაობს)",
              description: "API-დან ვერ ჩაიტვირთა რეალური პროექტები",
              location: "თბილისი",
              status: "active",
              totalUnits: 50,
              soldUnits: 10,
              startDate: new Date().toISOString(),
              completionDate: undefined,
              minPrice: 100000,
              maxPrice: 300000,
              developer: {
                id: 1,
                name: "ტესტ დეველოპერი",
                email: "test@example.com"
              },
              createdAt: new Date().toISOString(),
              images: []
            }
          ];
          setProjects(mockProjects);
        }
      } else {
        const errorText = await response.text();
        console.error('API Error - Status:', response.status);
        console.error('API Error - Body:', errorText);
        
        toast({
          title: "API შეცდომა",
          description: `სტატუსი: ${response.status}. შეამოწმეთ კონსოლი დეტალებისთვის.`,
          variant: "destructive",
        });
        
        // Show mock data when API fails
        const mockProjects: Project[] = [
          {
            id: 998,
            title: "მოკი პროექტი (API შეცდომა)",
            description: `API დააბრუნა შეცდომა: ${response.status}`,
            location: "თბილისი",
            status: "inactive",
            totalUnits: 0,
            soldUnits: 0,
            startDate: new Date().toISOString(),
            completionDate: undefined,
            minPrice: 0,
            maxPrice: 0,
            developer: {
              id: 1,
              name: "მოკი დეველოპერი",
              email: "mock@example.com"
            },
            createdAt: new Date().toISOString(),
            images: []
          }
        ];
        setProjects(mockProjects);
      }
    } catch (error: any) {
      console.error('Network/Parse Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: "ქსელის შეცდომა",
        description: `${error.message}. შეამოწმეთ კონსოლი დეტალებისთვის.`,
        variant: "destructive",
      });
      
      // Show mock data on network error
      const mockProjects: Project[] = [
        {
          id: 997,
          title: "მოკი პროექტი (ქსელის შეცდომა)",
          description: `ქსელის შეცდომა: ${error.message}`,
          location: "თბილისი",
          status: "inactive",
          totalUnits: 0,
          soldUnits: 0,
          startDate: new Date().toISOString(),
          completionDate: undefined,
          minPrice: 0,
          maxPrice: 0,
          developer: {
            id: 1,
            name: "მოკი დეველოპერი",
            email: "mock@example.com"
          },
          createdAt: new Date().toISOString(),
          images: []
        }
      ];
      setProjects(mockProjects);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        // Remove from local state on successful delete
        setProjects(projects.filter(p => p.id !== projectId));
        
        toast({
          title: "წარმატება",
          description: "პროექტი წარმატებით წაიშალა",
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "შეცდომა",
        description: "პროექტის წაშლისას მოხდა შეცდომა",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "აქტიური";
      case "completed": return "დასრულებული";
      case "planned": return "დაგეგმილი";
      case "inactive": return "არააქტიური";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">პროექტების მართვა</h1>
          <p className="text-gray-600">ყველა პროექტის ნახვა და მართვა</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>პროექტების ჩატვირთვა...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">პროექტების მართვა</h1>
        <p className="text-gray-600">ყველა პროექტის ნახვა და მართვა ({projects.length} პროექტი)</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>პროექტების სია</CardTitle>
              <CardDescription>ყველა პროექტის ნახვა, დამტკიცება და მართვა</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                ფილტრი
              </Button>
              <Button size="sm" onClick={fetchProjects}>
                <Plus className="h-4 w-4 mr-2" />
                განახლება
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="border hover:shadow-sm transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    {/* Image placeholder */}
                    <div className="relative flex-shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop"
                        alt={project.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg truncate pr-4">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {formatPrice(project.minPrice)} - {formatPrice(project.maxPrice)} ₾
                          </span>
                          <Badge className={`${getStatusColor(project.status)} px-2 py-1`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">{project.location}</span>
                        <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">
                          {project.soldUnits}/{project.totalUnits} გაყიდული
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">
                          დეველოპერი: {project.developer.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>დაიწყო: {formatDate(project.startDate)}</span>
                        </div>
                        {project.completionDate && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>დასრულება: {formatDate(project.completionDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        title="ნახვა"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs">ნახვა</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => navigate(`/admin/edit-project/${project.id}`)}
                        title="რედაქტირება"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-xs">რედაქტირება</span>
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate(`/admin/projects/${project.id}/manage-properties`)}
                        title="განცხადების მართვა"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        <span className="text-xs">განცხადების მართვა</span>
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
                            <AlertDialogTitle>პროექტის წაშლა</AlertDialogTitle>
                            <AlertDialogDescription>
                              დარწმუნებული ხართ, რომ გსურთ ამ პროექტის წაშლა? ეს მოქმედება შეუქცევადია.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(project.id)} 
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
          
          {projects.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">პროექტები ვერ მოიძებნა</p>
              <Button onClick={fetchProjects}>
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

export default AdminProjects;