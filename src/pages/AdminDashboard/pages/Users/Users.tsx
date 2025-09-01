import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCard } from './components/UserCard';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Users as UsersIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'developer' | 'agency';
  createdAt: string;
  updatedAt: string;
  propertyCount?: number;
}

interface UserCardProps {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  avatar?: string;
  joinDate: string;
  lastActive: string;
  propertiesCount: number;
  verified: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.getUsers();
      const allUsers = response?.users || [];
      // Filter out admin users as requested
      const nonAdminUsers = allUsers.filter((user: User) => user.role !== 'admin');
      setUsers(nonAdminUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "შეცდომა",
        description: "მომხმარებლების ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await adminApi.deleteUser(userId.toString());
      
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: "წარმატება",
        description: "მომხმარებელი წარმატებით წაიშალა",
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "მომხმარებლის წაშლისას მოხდა შეცდომა";
      toast({
        title: "შეცდომა",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const transformedUsers = users.map((user) => ({
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone || undefined,
    role: user.role,
    status: 'active' as const, // Default to active since we don't have this field
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`,
    joinDate: new Date(user.createdAt).toLocaleDateString('ka-GE'),
    lastActive: "უცნობია", // Not available in current API response
    propertiesCount: user.propertyCount || 0,
    verified: true // Default to verified
  }));

  const activeUsers = transformedUsers.filter(user => user.status === 'active').length;
  const totalProperties = transformedUsers.reduce((sum, user) => sum + user.propertiesCount, 0);

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">მომხმარებლების მართვა</h1>
          <p className="text-gray-600">მომხმარებლების სია და მართვა</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>მომხმარებლების ჩატვირთვა...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">მომხმარებლების მართვა</h1>
        <p className="text-gray-600">მომხმარებლების სია და მართვა ({transformedUsers.length} მომხმარებელი)</p>
        
        {/* Quick Stats */}
        <div className="flex gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-600">სულ მომხმარებლები</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{transformedUsers.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600">აქტიური მომხმარებლები</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{activeUsers}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-600">სულ განცხადებები</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{totalProperties}</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>მომხმარებლების სია</CardTitle>
              <CardDescription>ყველა რეგისტრირებული მომხმარებლის ნახვა და მართვა</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                ფილტრი
              </Button>
              <Button size="sm" onClick={fetchAllUsers}>
                <Plus className="h-4 w-4 mr-2" />
                განახლება
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transformedUsers.map((user) => (
              <UserCard
                key={user.id}
                {...user}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
          
          {transformedUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">მომხმარებლები ვერ მოიძებნა</p>
              <Button onClick={fetchAllUsers}>
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

export default Users;