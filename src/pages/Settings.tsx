import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/utils/languageUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, LucideShield, User, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { getPinterestAuthUrl, isPinterestConnected } from "@/utils/pinterestApiUtils";
import { useAuth } from "@/contexts/AuthContext";
const Settings = () => {
  const {
    t
  } = useLanguage();
  const {
    user
  } = useAuth();
  const [pinterestStatus, setPinterestStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const checkPinterestConnection = async () => {
      if (user) {
        setLoading(true);
        const isConnected = await isPinterestConnected(user.id);
        setPinterestStatus(isConnected);
        setLoading(false);
      }
    };
    checkPinterestConnection();
  }, [user]);
  const handleConnectPinterest = () => {
    window.location.href = getPinterestAuthUrl();
  };
  return <DashboardLayout>
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
          <TabsTrigger value="integrations" className="gap-2">
            <Link className="h-4 w-4" />
            <span>{t('integrations')}</span>
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
                  <input type="text" className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('email')}</label>
                  <input type="email" className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700" defaultValue="john@example.com" />
                </div>
              </div>
              <Button className="text-white bg-pinterest-red">{t('saveChanges')}</Button>
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
        
        <TabsContent value="integrations">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected social media accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-pinterest-red">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Pinterest</p>
                      <p className="text-sm text-gray-500">
                        {loading ? "Checking connection status..." : pinterestStatus ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button variant={pinterestStatus ? "outline" : "default"} className={pinterestStatus ? "" : "bg-pinterest-red"} onClick={handleConnectPinterest} disabled={loading}>
                    {pinterestStatus ? "Reconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>;
};
export default Settings;