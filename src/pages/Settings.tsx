
import { useEffect, useState, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/utils/languageUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, LucideShield, User, Link } from "lucide-react";
import { openPinterestAuthPopup, isPinterestConnected } from "@/utils/pinterestApiUtils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Settings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [pinterestStatus, setPinterestStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [pinterestUsername, setPinterestUsername] = useState<string>("");
  const [showConnectDialog, setShowConnectDialog] = useState<boolean>(false);
  
  // Ref to store the Pinterest auth popup
  const pinterestPopupRef = useRef<Window | null>(null);
  // Interval ref to check popup status
  const popupCheckIntervalRef = useRef<number | null>(null);

  // Check Pinterest connection on mount
  useEffect(() => {
    const checkPinterestConnection = async () => {
      if (user) {
        setLoading(true);
        try {
          const isConnected = await isPinterestConnected(user.id);
          setPinterestStatus(isConnected);
          
          // Get Pinterest username if connected
          if (isConnected) {
            const { data } = await fetch('/api/pinterest/user-info')
              .then(res => res.json())
              .catch(() => ({ data: null }));
              
            if (data?.username) {
              setPinterestUsername(data.username);
            }
          }
        } catch (error) {
          console.error("Error checking Pinterest connection:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    checkPinterestConnection();
  }, [user]);

  // Setup message listener for Pinterest auth popup
  useEffect(() => {
    const handlePinterestAuthMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return;
      }
      
      // Handle success message
      if (event.data?.type === "PINTEREST_AUTH_SUCCESS") {
        toast.success("Pinterest account connected successfully!");
        setPinterestStatus(true);
        if (event.data?.data?.username) {
          setPinterestUsername(event.data.data.username);
        }
        // Clear popup check interval if exists
        if (popupCheckIntervalRef.current) {
          window.clearInterval(popupCheckIntervalRef.current);
          popupCheckIntervalRef.current = null;
        }
      }
      
      // Handle error message
      if (event.data?.type === "PINTEREST_AUTH_ERROR") {
        toast.error(`Pinterest connection failed: ${event.data.error}`);
        // Clear popup check interval if exists
        if (popupCheckIntervalRef.current) {
          window.clearInterval(popupCheckIntervalRef.current);
          popupCheckIntervalRef.current = null;
        }
      }
    };
    
    // Add event listener for messages from popup
    window.addEventListener("message", handlePinterestAuthMessage);
    
    // Cleanup function
    return () => {
      window.removeEventListener("message", handlePinterestAuthMessage);
      // Clear any existing intervals
      if (popupCheckIntervalRef.current) {
        window.clearInterval(popupCheckIntervalRef.current);
      }
    };
  }, []);

  // Handle Pinterest connection
  const handleConnectPinterest = useCallback(() => {
    // Clear any existing popup check interval
    if (popupCheckIntervalRef.current) {
      window.clearInterval(popupCheckIntervalRef.current);
      popupCheckIntervalRef.current = null;
    }
    
    // Open the Pinterest auth popup
    const popup = openPinterestAuthPopup();
    
    if (popup) {
      // Store the popup reference
      pinterestPopupRef.current = popup;
      
      // Set up an interval to check if popup is closed
      popupCheckIntervalRef.current = window.setInterval(() => {
        if (pinterestPopupRef.current?.closed) {
          // Popup was closed, clear the interval
          if (popupCheckIntervalRef.current) {
            window.clearInterval(popupCheckIntervalRef.current);
            popupCheckIntervalRef.current = null;
          }
          
          // Check if user connected Pinterest (as a fallback if message wasn't received)
          if (user) {
            isPinterestConnected(user.id).then(connected => {
              if (connected && !pinterestStatus) {
                toast.success("Pinterest account connected successfully!");
                setPinterestStatus(true);
              }
            });
          }
        }
      }, 1000);
    } else {
      // Popup failed to open, show the inline dialog instead
      setShowConnectDialog(true);
    }
  }, [user, pinterestStatus]);

  // Handle direct (non-popup) Pinterest connection
  const handleDirectConnect = () => {
    // Redirect to Pinterest OAuth URL
    window.location.href = `https://www.pinterest.com/oauth/?client_id=${import.meta.env.VITE_PINTEREST_APP_ID}&redirect_uri=${encodeURIComponent(`${window.location.origin}/pinterest-callback`)}&response_type=code&scope=boards:read,pins:read,user_accounts:read,pins:write,boards:write`;
  };

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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Pinterest</p>
                      <p className="text-sm text-gray-500">
                        {loading ? "Checking connection status..." : 
                          pinterestStatus ? `Connected${pinterestUsername ? ` as ${pinterestUsername}` : ''}` : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={pinterestStatus ? "outline" : "default"} 
                    className={pinterestStatus ? "" : "bg-pinterest-red"} 
                    onClick={handleConnectPinterest} 
                    disabled={loading}
                  >
                    {pinterestStatus ? "Reconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Fallback dialog for when popup is blocked */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to Pinterest</DialogTitle>
            <DialogDescription>
              Popup windows were blocked. You can connect your Pinterest account directly instead.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 p-6">
            <p className="text-sm text-gray-500">
              To analyze your Pinterest account data, we need your permission to access your Pinterest account. 
              Click the button below to connect.
            </p>
            <Button
              className="w-full bg-pinterest-red"
              onClick={handleDirectConnect}
            >
              Connect to Pinterest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;
