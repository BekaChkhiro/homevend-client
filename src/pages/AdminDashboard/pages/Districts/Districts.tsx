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
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/api";

interface District {
  id: number;
  nameKa: string;
  nameEn: string;
  nameRu?: string;
  description?: string;
  pricePerSqm: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


const Districts = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [deletingDistrict, setDeletingDistrict] = useState<District | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nameKa: '',
    nameEn: '',
    nameRu: '',
    description: '',
    isActive: true,
    pricePerSqm: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const data = await adminApi.getDistricts();
      setDistricts(data || []);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('districts.messages.errorLoading');
      toast({
        title: t('common.error'),
        description: errorMessage,
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
      if (editingDistrict) {
        await adminApi.updateDistrict(editingDistrict.id.toString(), formData);
      } else {
        await adminApi.createDistrict(formData);
      }

      toast({
        title: t('common.success'),
        description: editingDistrict ? t('districts.messages.updated') : t('districts.messages.created')
      });
      resetForm();
      fetchDistricts();
    } catch (error: any) {
      console.error('Error saving district:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('districts.messages.errorSaving');
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (district: District) => {
    try {
      await adminApi.deleteDistrict(district.id.toString());
      toast({
        title: t('common.success'),
        description: t('districts.messages.deleted')
      });
      fetchDistricts();
    } catch (error: any) {
      console.error('Error deleting district:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('districts.messages.errorDeleting');
      toast({
        title: t('common.error'),
        description: errorMessage,
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
      nameRu: '',
      description: '',
      isActive: true,
      pricePerSqm: ''
    });
    setEditingDistrict(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (district: District) => {
    setFormData({
      nameKa: district.nameKa,
      nameEn: district.nameEn,
      nameRu: district.nameRu || '',
      description: district.description || '',
      isActive: district.isActive,
      pricePerSqm: district.pricePerSqm ? district.pricePerSqm.toString() : ''
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
          <h1 className="text-2xl font-bold text-gray-900">{t('districts.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('districts.subtitle')}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('districts.buttons.newDistrict')}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingDistrict ? t('districts.form.editTitle') : t('districts.form.addTitle')}
                </DialogTitle>
                <DialogDescription>
                  {t('districts.form.description')}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nameKa">{t('districts.form.nameKa')} *</Label>
                  <Input
                    id="nameKa"
                    value={formData.nameKa}
                    onChange={(e) => setFormData({ ...formData, nameKa: e.target.value })}
                    placeholder={t('districts.form.placeholders.nameKa')}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nameEn">{t('districts.form.nameEn')} *</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder={t('districts.form.placeholders.nameEn')}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nameRu">{t('districts.form.nameRu')}</Label>
                  <Input
                    id="nameRu"
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    placeholder={t('districts.form.placeholders.nameRu')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">{t('districts.form.descriptionField')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('districts.form.placeholders.description')}
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pricePerSqm">{t('districts.form.pricePerSqm')} *</Label>
                  <Input
                    id="pricePerSqm"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerSqm}
                    onChange={(e) => setFormData({ ...formData, pricePerSqm: e.target.value })}
                    placeholder={t('districts.form.placeholders.price')}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">{t('districts.form.isActive')}</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  {t('districts.buttons.cancel')}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? t('districts.buttons.saving') : editingDistrict ? t('districts.buttons.update') : t('districts.buttons.save')}
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
                        {t('districts.status.active')}
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        {t('districts.status.inactive')}
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

              {district.pricePerSqm && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">{t('districts.labels.pricePerSqm')}</span>
                    <span className="text-lg font-bold text-green-600">
                      ${district.pricePerSqm.toLocaleString()} USD
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{t('districts.labels.created')} {new Date(district.createdAt).toLocaleDateString('ka-GE')}</span>
                <span>{t('districts.labels.updated')} {new Date(district.updatedAt).toLocaleDateString('ka-GE')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(district)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {t('districts.buttons.edit')}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('districts.empty.title')}</h3>
          <p className="text-gray-500 mb-4">
            {t('districts.empty.description')}
          </p>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t('districts.buttons.addNew')}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingDistrict} onOpenChange={() => setDeletingDistrict(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('districts.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('districts.deleteDialog.description', { name: deletingDistrict?.nameKa })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('districts.deleteDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDistrict && handleDelete(deletingDistrict)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('districts.deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Districts;