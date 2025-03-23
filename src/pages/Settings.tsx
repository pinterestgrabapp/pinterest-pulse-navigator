
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/utils/languageUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, LucideShield, User } from "lucide-react";

const Settings = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settings')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('settingsDescription')}
        </p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span>{t('account')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span>{t('notifications')}</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <LucideShield className="h-4 w-4" />
            <span>{t('privacy')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle>{t('profile')}</CardTitle>
              <CardDescription>{t('profileSettings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('name')}</label>
                  <input 
                    type="text" 
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700"
                    defaultValue="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('email')}</label>
                  <input 
                    type="email" 
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700"
                    defaultValue="john@example.com"
                  />
                </div>
              </div>
              <Button>{t('saveChanges')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('notificationSettings')}</CardTitle>
              <CardDescription>{t('notificationDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('emailNotifications')}</p>
                    <p className="text-sm text-gray-500">{t('emailNotificationsDescription')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('rankingAlerts')}</p>
                    <p className="text-sm text-gray-500">{t('rankingAlertsDescription')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('weeklyReports')}</p>
                    <p className="text-sm text-gray-500">{t('weeklyReportsDescription')}</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('privacySettings')}</CardTitle>
              <CardDescription>{t('privacyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('dataSharing')}</p>
                    <p className="text-sm text-gray-500">{t('dataSharingDescription')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('analytics')}</p>
                    <p className="text-sm text-gray-500">{t('analyticsDescription')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
