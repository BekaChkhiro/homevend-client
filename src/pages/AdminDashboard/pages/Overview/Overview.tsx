import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Home, 
  FileText, 
  Building2,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalDevelopers: number;
  totalAgencies: number;
  totalProperties: number;
  totalProjects: number;
  monthlyUsers: number;
  monthlyProperties: number;
}

interface RecentUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface RecentProperty {
  id: number;
  title: string;
  propertyType: string;
  dealType: string;
  price: number;
  location: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
  };
}

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentListings, setRecentListings] = useState<RecentProperty[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Dashboard data received:', result.data);
      console.log('Recent users count:', result.data.recentUsers?.length);
      console.log('Recent properties count:', result.data.recentProperties?.length);
      
      setStats(result.data.stats);
      setRecentListings(result.data.recentProperties || []);
      setRecentUsers(result.data.recentUsers || []);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "შეცდომა",
        description: "მონაცემების ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ka-GE', {
      style: 'currency',
      currency: 'GEL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin": return "ადმინი";
      case "developer": return "დეველოპერი";
      case "agency": return "სააგენტო";
      case "user": return "მომხმარებელი";
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ადმინისტრატორის პანელი</h1>
          <p className="text-gray-600">მართეთ პლატფორმა და მონიტორინგი გაუწიეთ აქტივობებს</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>მონაცემების ჩატვირთვა...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = stats ? [
    { title: 'სულ მომხმარებლები', value: stats.totalUsers.toString(), icon: Users, change: `+${stats.monthlyUsers} ამ თვეში` },
    { title: 'აქტიური განცხადებები', value: stats.totalProperties.toString(), icon: Home, change: `+${stats.monthlyProperties} ამ თვეში` },
    { title: 'პროექტები', value: stats.totalProjects.toString(), icon: Building2, change: 'სულ პროექტები' },
    { title: 'ადმინისტრატორები', value: stats.totalAdmins.toString(), icon: FileText, change: 'სისტემის ადმინები' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ადმინისტრატორის პანელი</h1>
        <p className="text-gray-600">მართეთ პლატფორმა და მონიტორინგი გაუწიეთ აქტივობებს</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-blue-600 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>უახლესი განცხადებები</CardTitle>
            <CardDescription>ბოლოს დამატებული 5 განცხადება ({recentListings.length} ნაჩვენებია)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentListings.length > 0 ? (
                recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{listing.title}</h4>
                      <p className="text-sm text-gray-600">მომხმარებელი: {listing.user.fullName}</p>
                      <p className="text-sm text-gray-600">მდებარეობა: {listing.location || 'მითითებული არ არის'}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm font-medium text-primary">{formatPrice(listing.price)}</p>
                        <p className="text-xs text-gray-500">{formatDate(listing.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  განცხადებები ვერ მოიძებნა
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ახალი მომხმარებლები</CardTitle>
            <CardDescription>ბოლოს დარეგისტრირებული 5 მომხმარებელი ({recentUsers.length} ნაჩვენებია)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{user.fullName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {getRoleText(user.role)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  მომხმარებლები ვერ მოიძებნა
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;