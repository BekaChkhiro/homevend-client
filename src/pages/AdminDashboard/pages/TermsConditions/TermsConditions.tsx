import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save, Eye, FileText, Globe, History, AlertCircle,
  Plus, Trash2, GripVertical, ChevronUp, ChevronDown
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/api";
// Import drag and drop components with fallback
let DragDropContext: any, Droppable: any, Draggable: any;
try {
  const dnd = require('@hello-pangea/dnd');
  DragDropContext = dnd.DragDropContext;
  Droppable = dnd.Droppable;
  Draggable = dnd.Draggable;
} catch (e) {
  // Fallback components if library is not available
  DragDropContext = ({ children, onDragEnd }: any) => children;
  Droppable = ({ children }: any) => children({ droppableProps: {}, innerRef: () => {}, placeholder: null });
  Draggable = ({ children, index }: any) => children({
    innerRef: () => {},
    draggableProps: {},
    dragHandleProps: {}
  }, { isDragging: false });
}

interface TermsSection {
  id: string;
  order: number;
  headerKa: string;
  headerEn: string;
  headerRu: string;
  contentKa: string;
  contentEn: string;
  contentRu: string;
}

interface TermsConditionsData {
  id?: number;
  sections: TermsSection[];
  version?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const TermsConditions = () => {
  const [termsData, setTermsData] = useState<TermsConditionsData>({
    sections: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState<'ka' | 'en' | 'ru'>('en');
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'ka' | 'en' | 'ru'>('ka');
  const { toast } = useToast();
  const { t, i18n } = useTranslation('admin');

  useEffect(() => {
    fetchTermsConditions();
  }, []);

  const fetchTermsConditions = async () => {
    try {
      const data = await adminApi.getTermsConditions();
      if (data) {
        // Ensure sections is an array
        if (typeof data.sections === 'string') {
          try {
            data.sections = JSON.parse(data.sections);
          } catch {
            data.sections = [];
          }
        }
        setTermsData({
          ...data,
          sections: data.sections || []
        });
      } else {
        // Initialize with default sections
        setTermsData({
          sections: [
            {
              id: generateId(),
              order: 0,
              headerKa: 'ჩვენს შესახებ',
              headerEn: 'About Us',
              headerRu: 'О нас',
              contentKa: 'შპს „ლარჯ ჰოუმ 2025" ს/ნ 405780757\nმისამართი: ქ. თბილისი, ბერბუკის ქ. N7',
              contentEn: 'LLC "Large Home 2025"\nAddress: Tbilisi, Berbuki St. N7',
              contentRu: 'ООО "Лардж Хоум 2025"\nАдрес: г. Тбилиси, ул. Бербуки N7'
            }
          ]
        });
      }
    } catch (error: any) {
      console.error('Error fetching terms and conditions:', error);
      toast({
        title: t('common.error'),
        description: t('termsConditions.messages.errorLoading') || 'Failed to load terms and conditions',
        variant: "destructive"
      });
      // Initialize with empty sections on error
      setTermsData({ sections: [] });
    } finally {
      setLoading(false);
    }
  };

  const generateId = () => {
    return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSave = async () => {
    setSubmitting(true);

    try {
      const dataToSave = {
        ...termsData,
        sections: termsData.sections.map((section, index) => ({
          ...section,
          order: index
        }))
      };

      if (termsData.id) {
        await adminApi.updateTermsConditions(termsData.id.toString(), dataToSave);
      } else {
        await adminApi.createTermsConditions(dataToSave);
      }

      toast({
        title: t('common.success'),
        description: t('termsConditions.messages.saved') || 'Terms and conditions saved successfully'
      });
      setHasChanges(false);
      fetchTermsConditions();
    } catch (error: any) {
      console.error('Error saving terms and conditions:', error);
      toast({
        title: t('common.error'),
        description: t('termsConditions.messages.errorSaving') || 'Failed to save terms and conditions',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addSection = () => {
    const newSection: TermsSection = {
      id: generateId(),
      order: termsData.sections.length,
      headerKa: '',
      headerEn: '',
      headerRu: '',
      contentKa: '',
      contentEn: '',
      contentRu: ''
    };

    setTermsData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setHasChanges(true);
  };

  const removeSection = (sectionId: string) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
    setHasChanges(true);
  };

  const updateSection = (sectionId: string, field: keyof TermsSection, value: string) => {
    setTermsData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
    setHasChanges(true);
  };

  const moveSection = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= termsData.sections.length) return;

    const newSections = [...termsData.sections];
    [newSections[fromIndex], newSections[toIndex]] = [newSections[toIndex], newSections[fromIndex]];

    setTermsData(prev => ({
      ...prev,
      sections: newSections
    }));
    setHasChanges(true);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(termsData.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTermsData(prev => ({
      ...prev,
      sections: items
    }));
    setHasChanges(true);
  };

  const renderSectionEditor = (section: TermsSection, index: number) => {
    const getFieldName = (base: string) => {
      switch (activeTab) {
        case 'ka': return `${base}Ka`;
        case 'ru': return `${base}Ru`;
        default: return `${base}En`;
      }
    };

    const getPlaceholder = (type: 'header' | 'content') => {
      const placeholders = {
        header: {
          ka: 'შეიყვანეთ სათაური ქართულად...',
          en: 'Enter header in English...',
          ru: 'Введите заголовок на русском...'
        },
        content: {
          ka: 'შეიყვანეთ ტექსტი ქართულად...',
          en: 'Enter content in English...',
          ru: 'Введите содержание на русском...'
        }
      };
      return placeholders[type][activeTab];
    };

    return (
      <Draggable key={section.id} draggableId={section.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-4 ${snapshot.isDragging ? 'shadow-lg opacity-90' : ''}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div {...provided.dragHandleProps}>
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  </div>
                  <Badge variant="outline">
                    {t('termsConditions.section') || 'Section'} {index + 1}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === termsData.sections.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`header-${section.id}`}>
                    {t('termsConditions.sectionHeader') || 'Section Header'}
                  </Label>
                  <Input
                    id={`header-${section.id}`}
                    value={section[getFieldName('header') as keyof TermsSection] as string}
                    onChange={(e) => updateSection(section.id, getFieldName('header') as keyof TermsSection, e.target.value)}
                    placeholder={getPlaceholder('header')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`content-${section.id}`}>
                    {t('termsConditions.sectionContent') || 'Section Content'}
                  </Label>
                  <Textarea
                    id={`content-${section.id}`}
                    value={section[getFieldName('content') as keyof TermsSection] as string}
                    onChange={(e) => updateSection(section.id, getFieldName('content') as keyof TermsSection, e.target.value)}
                    placeholder={getPlaceholder('content')}
                    className="mt-1 min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  };

  const renderPreviewContent = () => {
    return termsData.sections.map((section, index) => {
      const header = previewLanguage === 'ka' ? section.headerKa :
                     previewLanguage === 'ru' ? section.headerRu :
                     section.headerEn;
      const content = previewLanguage === 'ka' ? section.contentKa :
                     previewLanguage === 'ru' ? section.contentRu :
                     section.contentEn;

      if (!header && !content) return null;

      return (
        <div key={section.id} className="mb-8">
          {header && (
            <h2 className="text-xl font-semibold mb-3 text-foreground">
              {header}
            </h2>
          )}
          {content && (
            <div className="text-muted-foreground whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t('termsConditions.title') || 'Terms & Conditions Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('termsConditions.subtitle') || 'Manage terms and conditions sections in multiple languages'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {t('termsConditions.buttons.preview') || 'Preview'}
            </Button>

            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{t('termsConditions.preview.title') || 'Preview Terms & Conditions'}</DialogTitle>
                <DialogDescription>
                  {t('termsConditions.preview.description') || 'This is how the terms will appear to users'}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={previewLanguage} onValueChange={(v) => setPreviewLanguage(v as 'ka' | 'en' | 'ru')}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ka">ქართული</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ru">Русский</TabsTrigger>
                </TabsList>

                <TabsContent value={previewLanguage}>
                  <ScrollArea className="h-[500px] w-full rounded-md border p-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <h1 className="text-2xl font-bold mb-6">
                        {previewLanguage === 'ka' ? 'წესები და პირობები' :
                         previewLanguage === 'ru' ? 'Правила и условия' :
                         'Terms and Conditions'}
                      </h1>
                      {renderPreviewContent()}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleSave}
            disabled={submitting || !hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {submitting ? (t('termsConditions.buttons.saving') || 'Saving...') : (t('termsConditions.buttons.save') || 'Save Changes')}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('termsConditions.messages.unsavedChanges') || 'You have unsaved changes'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('termsConditions.form.title') || 'Terms & Conditions Sections'}
          </CardTitle>
          <CardDescription>
            {t('termsConditions.form.description') || 'Add and manage sections for your terms and conditions in each language'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ka' | 'en' | 'ru')} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="ka">
                ქართული (Georgian)
                {termsData.sections.some(s => !s.headerKa && !s.contentKa) && (
                  <span className="ml-2 text-yellow-500">⚠</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="en">
                English
                {termsData.sections.some(s => !s.headerEn && !s.contentEn) && (
                  <span className="ml-2 text-yellow-500">⚠</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="ru">
                Русский (Russian)
                {termsData.sections.some(s => !s.headerRu && !s.contentRu) && (
                  <span className="ml-2 text-yellow-500">⚠</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {termsData.sections.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('termsConditions.empty.title') || 'No sections yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {t('termsConditions.empty.description') || 'Start by adding your first section'}
                  </p>
                  <Button onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('termsConditions.buttons.addSection') || 'Add Section'}
                  </Button>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {termsData.sections.map((section, index) =>
                          renderSectionEditor(section, index)
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}

              {termsData.sections.length > 0 && (
                <div className="flex justify-center pt-4">
                  <Button onClick={addSection} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('termsConditions.buttons.addSection') || 'Add Section'}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {termsData.updatedAt && (
            <div className="mt-6 text-sm text-muted-foreground">
              {t('termsConditions.lastUpdated') || 'Last updated'}: {new Date(termsData.updatedAt).toLocaleString(i18n.language === 'ka' ? 'ka-GE' : i18n.language === 'ru' ? 'ru-RU' : 'en-US')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsConditions;