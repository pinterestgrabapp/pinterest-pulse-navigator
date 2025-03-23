
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { useLanguage } from "@/utils/languageUtils";

const CreatePin = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('createPin')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('createPinDescription')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('pinDetails')}</CardTitle>
              <CardDescription>{t('pinDetailsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('pinTitle')}</Label>
                  <Input id="title" placeholder={t('pinTitlePlaceholder')} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('pinDescription')}</Label>
                  <Textarea 
                    id="description" 
                    placeholder={t('pinDescriptionPlaceholder')}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keywords">{t('pinKeywords')}</Label>
                  <Input id="keywords" placeholder={t('pinKeywordsPlaceholder')} />
                  <p className="text-xs text-gray-500">{t('pinKeywordsHelp')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">{t('destinationLink')}</Label>
                  <Input id="link" placeholder="https://example.com/my-page" type="url" />
                </div>
                
                <Button type="submit">{t('createPinButton')}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('pinImage')}</CardTitle>
              <CardDescription>{t('pinImageDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <div className="text-center p-4">
                    <ImagePlus className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">{t('dragImageHere')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('recommendedSize')}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">{t('uploadImage')}</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle>{t('pinPreview')}</CardTitle>
              <CardDescription>{t('pinPreviewDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[2/3] bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-400 text-sm">{t('previewWillAppearHere')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePin;
