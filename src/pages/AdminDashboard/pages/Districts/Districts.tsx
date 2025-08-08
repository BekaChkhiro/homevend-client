import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, MapPin, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface District {
  id: number;
  nameKa: string;
  nameEn: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PriceStatistic {
  id: number;
  propertyType: string;
  dealType: string;
  averagePricePerSqm: number;
  currency: string;
}

interface DistrictWithStats extends District {
  priceStatistics: PriceStatistic[];
  currentPricePerSqm?: number;
}

const Districts = () => {
  const [districts, setDistricts] = useState<DistrictWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [deletingDistrict, setDeletingDistrict] = useState<District | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nameKa: '',
    nameEn: '',
    description: '',
    isActive: true,
    pricePerSqm: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts');
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.data || []);
      } else {
        throw new Error('Failed to fetch districts');
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast({
        title: "შეცდომა",
        description: "რაიონების ჩატვირთვა ვერ მოხერხდა",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingDistrict ? 'PUT' : 'POST';
      const url = editingDistrict ? `/api/districts/${editingDistrict.id}` : '/api/districts';
      
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "წარმატება",
          description: editingDistrict ? "რაიონი წარმატებით განახლდა" : "რაიონი წარმატებით შეიქმნა"
        });
        resetForm();
        fetchDistricts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error saving district:', error);
      toast({
        title: "შეცდომა",
        description: error instanceof Error ? error.message : "რაიონის შენახვა ვერ მოხერხდა",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (district: District) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/districts/${district.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (response.ok) {
        toast({
          title: "წარმატება",
          description: "რაიონი წარმატებით წაიშალა"
        });
        fetchDistricts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting district:', error);
      toast({
        title: "შეცდომა",
        description: error instanceof Error ? error.message : "რაიონის წაშლა ვერ მოხერხდა",
        variant: "destructive"
      });
    } finally {
      setDeletingDistrict(null);
    }
  };

  const resetForm = () => {
    setFormData({
      nameKa: '',
      nameEn: '',
      description: '',
      isActive: true,
      pricePerSqm: ''
    });
    setEditingDistrict(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (district: DistrictWithStats) => {
    setFormData({
      nameKa: district.nameKa,
      nameEn: district.nameEn,
      description: district.description || '',
      isActive: district.isActive,
      pricePerSqm: district.currentPricePerSqm ? district.currentPricePerSqm.toString() : ''
    });
    setEditingDistrict(district);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">რაიონები და ფასები</h1>
          <p className="text-gray-600 mt-1">
            თბილისის რაიონების დამატება, რედაქტირება და კვადრატული მეტრის ფასების მართვა
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              ახალი რაიონი
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingDistrict ? 'რაიონის რედაქტირება' : 'ახალი რაიონის დამატება'}
                </DialogTitle>
                <DialogDescription>
                  შეიყვანეთ რაიონის ინფორმაცია ქართულ და ინგლისურ ენებზე.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nameKa">დასახელება (ქართული) *</Label>
                  <Input
                    id="nameKa"
                    value={formData.nameKa}
                    onChange={(e) => setFormData({ ...formData, nameKa: e.target.value })}
                    placeholder="მაგ: ვაკე"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nameEn">დასახელება (ინგლისური) *</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g: Vake"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">აღწერა</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="რაიონის აღწერა (არ არის სავალდებულო)"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pricePerSqm">ფასი 1 კვ/მ (USD) *</Label>
                  <Input
                    id="pricePerSqm"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerSqm}
                    onChange={(e) => setFormData({ ...formData, pricePerSqm: e.target.value })}
                    placeholder="მაგ: 2500"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">აქტიური რაიონი</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  გაუქმება
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'შენახვა...' : editingDistrict ? 'განახლება' : 'შენახვა'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districts.map((district) => (
          <Card key={district.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{district.nameKa}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {district.nameEn}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={district.isActive ? 'default' : 'secondary'} className="text-xs">
                    {district.isActive ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        აქტიური
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        არააქტიური
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {district.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {district.description}
                </p>
              )}

              {district.currentPricePerSqm && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">ფასი 1 კვ/მ:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${district.currentPricePerSqm.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>შექმნილია: {new Date(district.createdAt).toLocaleDateString('ka-GE')}</span>
                <span>განახლებულია: {new Date(district.updatedAt).toLocaleDateString('ka-GE')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(district)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  რედაქტირება
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingDistrict(district)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {districts.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">რაიონები არ არის</h3>
          <p className="text-gray-500 mb-4">
            დაამატეთ ახალი რაიონები სისტემაში
          </p>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            ახალი რაიონის დამატება
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingDistrict} onOpenChange={() => setDeletingDistrict(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>რაიონის წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              დარწმუნებული ხართ, რომ გსურთ "{deletingDistrict?.nameKa}" რაიონის წაშლა?
              ეს მოქმედება შეუქცევადია.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDistrict && handleDelete(deletingDistrict)}
              className="bg-red-600 hover:bg-red-700"
            >
              წაშლა
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Districts;