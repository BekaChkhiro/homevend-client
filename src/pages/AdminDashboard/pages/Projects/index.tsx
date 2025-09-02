import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Loader2, Eye, Edit, Trash2, MapPin, Calendar, User, Building, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/api';
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
  developerId: number;
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
      const result = await adminApi.getProjects();
      
      // Handle different response formats
      let projectsData = [];
      
      if (result && result.projects) {
        projectsData = result.projects;
      } else if (Array.isArray(result)) {
        projectsData = result;
      } else if (result) {
        projectsData = [result]; // Single project
      }
      
      if (Array.isArray(projectsData) && projectsData.length > 0) {
        // Transform API data to match our interface
        const transformedProjects = projectsData.map((proj: any) => ({
          id: proj.id,
          title: proj.projectName || proj.title || `პროექტი #${proj.id}`,
          description: proj.description || "",
          location: proj.fullAddress || proj.location || proj.address || `${proj.street || ""} ${proj.city?.nameGeorgian || proj.city || ""}`.trim(),
          status: proj.deliveryStatus || proj.status || "active",
          totalUnits: proj.totalUnits || 0,
          soldUnits: proj.soldUnits || 0,
          startDate: proj.createdAt || new Date().toISOString(),
          completionDate: proj.deliveryDate,
          minPrice: proj.minPrice || 0,
          maxPrice: proj.maxPrice || 0,
          developer: {
            id: proj.developer?.id || proj.developerId || 0,
            name: proj.developer?.fullName || "უცნობი დეველოპერი",
            email: proj.developer?.email || ""
          },
          developerId: proj.developerId || proj.developer?.id || 0,
          createdAt: proj.createdAt || new Date().toISOString(),
          images: proj.images || []
        }));
        
        setProjects(transformedProjects);
      } else {
        setProjects([]);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "პროექტების ჩატვირთვისას მოხდა შეცდომა";
      
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
      
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      await adminApi.deleteProject(projectId.toString());
      
      // Remove from local state on successful delete
      setProjects(projects.filter(p => p.id !== projectId));
      
      toast({
        title: "წარმატება",
        description: "პროექტი წარმატებით წაიშალა",
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "პროექტის წაშლისას მოხდა შეცდომა";
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed_with_renovation": return "bg-green-100 text-green-800";
      case "green_frame": return "bg-emerald-100 text-emerald-800";
      case "black_frame": return "bg-gray-100 text-gray-800";
      case "white_frame": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed_with_renovation": return "ჩაბარება რემონტით";
      case "green_frame": return "მწვანე კარკასი";
      case "black_frame": return "შავი კარკასი";
      case "white_frame": return "თეთრი კარკასი";
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
                          <Badge className={`${getStatusColor(project.status)} px-2 py-1`}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{project.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <User className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate mr-4">
                          დეველოპერი ID: {project.developerId}
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