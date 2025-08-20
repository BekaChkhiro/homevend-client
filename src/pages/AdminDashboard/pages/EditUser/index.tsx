import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, User, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'developer' | 'agency';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  verified: boolean;
  createdAt: string;
  propertyCount?: number;
}

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "user" as 'user' | 'admin' | 'developer' | 'agency',
    status: "active" as 'active' | 'inactive' | 'suspended' | 'pending',
    verified: false
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const result = await response.json();
      const userData = result.data;
      
      const user: User = {
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || "",
        role: userData.role,
        status: "active", // Default since we don't have this in backend
        verified: true, // Default since we don't have this in backend
        createdAt: userData.createdAt,
        propertyCount: userData.propertyCount || 0
      };
      
      setUser(user);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        status: user.status,
        verified: user.verified
      });
    } catch (error: any) {
      toast({
        title: "შეცდომა",
        description: "მომხმარებლის ჩატვირთვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.fullName.trim()) {
        toast({
          title: "შეცდომა",
          description: "სახელი და გვარი აუცილებელია",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.email.trim()) {
        toast({
          title: "შეცდომა",
          description: "ელ-ფოსტა აუცილებელია",
          variant: "destructive",
        });
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "შეცდომა",
          description: "ელ-ფოსტის ფორმატი არასწორია",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          role: formData.role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user: ${response.status}`);
      }
      
      toast({
        title: "წარმატება",
        description: "მომხმარებელი წარმატებით განახლდა",
      });
      
      navigate("/admin/users");
    } catch (error: any) {
      toast({
        title: "შეცდომა",
        description: error.message || "მომხმარებლის შენახვისას მოხდა შეცდომა",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/users")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            უკან დაბრუნება
          </Button>
          <h1 className="text-3xl font-bold">მომხმარებლის რედაქტირება</h1>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>მომხმარებლის ჩატვირთვა...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/users")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          უკან დაბრუნება
        </Button>
        <h1 className="text-3xl font-bold mb-2">მომხმარებლის რედაქტირება</h1>
        <p className="text-gray-600">მომხმარებელი #{id}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ძირითადი ინფორმაცია</CardTitle>
            <CardDescription>მომხმარებლის ძირითადი მონაცემების რედაქტირება</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">სახელი და გვარი</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="სახელი და გვარი"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">ელ-ფოსტა</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ელ-ფოსტა"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">ტელეფონი</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+995 555 123 456"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">როლი</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="აირჩიეთ როლი" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">მომხმარებელი</SelectItem>
                    <SelectItem value="admin">ადმინი</SelectItem>
                    <SelectItem value="developer">დეველოპერი</SelectItem>
                    <SelectItem value="agency">სააგენტო</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ანგარიშის ინფორმაცია</CardTitle>
            <CardDescription>დამატებითი ინფორმაცია მომხმარებლის შესახებ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">რეგისტრაციის თარიღი</div>
                <div className="text-lg font-semibold text-blue-900">
                  {user ? new Date(user.createdAt).toLocaleDateString('ka-GE') : '-'}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">განცხადებები</div>
                <div className="text-lg font-semibold text-green-900">{user?.propertyCount || 0}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">ბოლო აქტივობა</div>
                <div className="text-lg font-semibold text-purple-900">უცნობია</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/users")}
          >
            გაუქმება
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                შენახვა...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                ცვლილებების შენახვა
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;