
import { useEffect, useState, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/utils/languageUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, LucideShield, User, Link, Image, BarChart2, ShoppingCart, Check, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { hasScrapeHistory, getScrapeHistory } from "@/utils/pinterestApiUtils";

const Settings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [hasScrapingHistory, setHasScrapingHistory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [showConnectDialog, setShowConnectDialog] = useState<boolean>(false);
  
  useEffect(() => {
    const checkApifyUsage = async () => {
      if (user) {
        setLoading(true);
        try {
          const hasHistory = await hasScrapeHistory(user.id);
          setHasScrapingHistory(hasHistory);
          
          if (hasHistory) {
            const history = await getScrapeHistory(user.id);
            setRecentSearches(history || []);
          }
        } catch (error) {
          console.error("Error checking Apify usage:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkApifyUsage();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settings')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('settingsDescription')}
        </p>
      </div>
      
      <Tabs defaultValue="integrations" className="w-full">
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
          {/* Apify Integration Tab */}
          <Card className="border-gray-800 bg-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 100 100" fill="#00C0C8">
                  <path d="M32.38,97.96L32.38,97.96c-17.85,0-32.35-14.51-32.35-32.36c0-17.85,14.51-32.36,32.36-32.36h35.47c8.91,0,16.14-7.23,16.14-16.14c0-8.91-7.23-16.14-16.14-16.14c-8.91,0-16.14,7.23-16.14,16.14h-19.33c0-19.56,15.92-35.47,35.47-35.47c19.56,0,35.47,15.92,35.47,35.47c0,19.56-15.91,35.47-35.47,35.47H32.38c-8.91,0-16.14,7.23-16.14,16.14c0,8.91,7.23,16.14,16.14,16.14c8.91,0,16.14-7.23,16.14-16.14H67.85C67.85,82.04,51.93,97.96,32.38,97.96" fill="#00C0C8"/>
                </svg>
                Apify Pinterest Scraper
              </CardTitle>
              <CardDescription>
                Access Pinterest data using the Apify scraping service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-2 border border-gray-800 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${hasScrapingHistory ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="text-sm">
                      {hasScrapingHistory ? 'Active' : 'Ready to use'}
                    </p>
                    {hasScrapingHistory && <p className="text-xs text-gray-400">{recentSearches.length} recent searches</p>}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                  onClick={() => window.location.href = '/pin-analysis'}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span> 
                      Loading...
                    </>
                  ) : (
                    'Use Scraper'
                  )}
                </Button>
              </div>
              <Alert className="border-green-800 bg-green-950">
                <div className="flex gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm">Apify Pinterest scraper is ready to use.</p>
                    <p className="text-xs mt-1 text-gray-300">
                      You can scrape Pinterest data using any of the tools in the app.
                    </p>
                  </div>
                </div>
              </Alert>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-black mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Other Integrations
              </CardTitle>
              <CardDescription>
                Connect other platforms to enhance your Pinterest strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm">Instagram</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm">Google Analytics</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm">Shopify</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apify Integration</DialogTitle>
            <DialogDescription>
              Apify is already integrated into the application.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 p-6">
            <p className="text-sm text-gray-500">
              The Apify Pinterest scraper allows you to scrape data from Pinterest without requiring authentication.
            </p>
            <Button
              className="w-full bg-pinterest-red"
              onClick={() => {
                setShowConnectDialog(false);
                window.location.href = '/pin-analysis';
              }}
            >
              Go to Pin Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;
