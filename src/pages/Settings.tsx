
import { useState } from 'react';
import { Globe, Moon, Sun, User, Bell, Lock, CreditCard } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage, Language } from '@/utils/languageUtils';
import { LANGUAGES } from '@/lib/constants';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState('light');
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Here you would implement actual theme switching logic
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('settings')}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation Sidebar */}
            <Card className="lg:col-span-1 glass-card h-fit">
              <CardContent className="p-4">
                <Tabs defaultValue="preferences" orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col items-start p-0 h-auto bg-transparent">
                    <TabsTrigger 
                      value="preferences" 
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-accent rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4" />
                        <span>Preferences</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="account" 
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-accent rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4" />
                        <span>Account</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-accent rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-accent rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="h-4 w-4" />
                        <span>Security</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="billing" 
                      className="w-full justify-start px-4 py-3 data-[state=active]:bg-accent rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4" />
                        <span>Billing</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              <Tabs defaultValue="preferences" className="w-full">
                {/* Preferences Tab */}
                <TabsContent value="preferences" className="mt-0 space-y-6">
                  {/* Language Settings */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>{t('languagePreference')}</CardTitle>
                      <CardDescription>
                        Select the language you'd like to use for Pinterest Grab
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {LANGUAGES.map((lang) => (
                          <div
                            key={lang.code}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              language === lang.code 
                                ? 'bg-accent text-accent-foreground' 
                                : 'hover:bg-accent/50'
                            }`}
                            onClick={() => handleLanguageChange(lang.code as Language)}
                          >
                            <div className="text-xl">{lang.flag}</div>
                            <div>
                              <p className="font-medium">{lang.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{lang.code.toUpperCase()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Theme Settings */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>{t('theme')}</CardTitle>
                      <CardDescription>
                        Choose between light and dark mode
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Button
                          variant={theme === 'light' ? 'default' : 'outline'}
                          className="flex items-center gap-2 px-4"
                          onClick={() => handleThemeChange('light')}
                        >
                          <Sun className="h-4 w-4" />
                          <span>{t('lightMode')}</span>
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          className="flex items-center gap-2 px-4"
                          onClick={() => handleThemeChange('dark')}
                        >
                          <Moon className="h-4 w-4" />
                          <span>{t('darkMode')}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Account Tab */}
                <TabsContent value="account" className="mt-0 space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>{t('accountSettings')}</CardTitle>
                      <CardDescription>
                        Update your account information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <User className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="font-medium">Profile Picture</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Upload a new profile picture
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Upload
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Your email" />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button className="gap-2">
                            {t('saveChanges')}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                        <h3 className="font-medium mb-4">Pinterest Connection</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Connect your Pinterest account to enable pin creation directly from Pinterest Grab
                        </p>
                        <Button variant="outline">
                          Connect Pinterest Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-0 space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Manage how and when you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Receive notifications about your account via email
                            </p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Weekly Reports</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Get weekly reports about your Pinterest performance
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Ranking Changes</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Notifications when your pin rankings change significantly
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Product Updates</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Notifications about new features and improvements
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Security Tab */}
                <TabsContent value="security" className="mt-0 space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" placeholder="Enter your current password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" placeholder="Enter your new password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" placeholder="Confirm your new password" />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button>
                            Update Password
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Billing Tab */}
                <TabsContent value="billing" className="mt-0 space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Subscription & Billing</CardTitle>
                      <CardDescription>
                        Manage your subscription and payment details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="p-4 rounded-lg bg-accent">
                        <h3 className="font-medium mb-2">Current Plan: Free</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          You're currently on the free plan with limited features. Upgrade to unlock all features.
                        </p>
                        <Button>
                          Upgrade to Pro
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Plan Comparison</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h4 className="font-medium mb-2">Free Plan</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Basic keyword research</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Limited pin analysis (5/month)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                <span>No rank tracking</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                <span>No pin creation</span>
                              </li>
                            </ul>
                            <p className="mt-4 font-bold">$0 / month</p>
                          </div>
                          
                          <div className="p-4 rounded-lg border border-pinterest-red">
                            <h4 className="font-medium mb-2">Pro Plan</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Advanced keyword research</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Unlimited pin analysis</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Rank tracking for 100 keywords</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Direct pin creation & posting</span>
                              </li>
                            </ul>
                            <p className="mt-4 font-bold">$29 / month</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
