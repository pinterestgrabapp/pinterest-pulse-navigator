
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/utils/languageUtils";

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  
  const initialUserData = {
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    bio: user?.user_metadata?.bio || '',
    website: user?.user_metadata?.website || '',
  };
  
  const [userData, setUserData] = useState(initialUserData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the user profile here
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('profile')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('manageYourProfileInformation')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('profileInformation')}</CardTitle>
              <CardDescription>{t('manageYourPublicProfile')}</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                {t('edit')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setUserData(initialUserData);
                }}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleSubmit}>
                  {t('save')}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {initialUserData.name.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    {t('changePhoto')}
                  </Button>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('emailCannotBeChanged')}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('bio')}</Label>
                      <Input 
                        id="bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleChange}
                        placeholder={t('tellUsAboutYourself') as string}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">{t('website')}</Label>
                      <Input 
                        id="website"
                        name="website"
                        value={userData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('name')}
                      </h3>
                      <p className="mt-1">{initialUserData.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('email')}
                      </h3>
                      <p className="mt-1">{user?.email}</p>
                    </div>
                    
                    {initialUserData.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t('bio')}
                        </h3>
                        <p className="mt-1">{initialUserData.bio}</p>
                      </div>
                    )}
                    
                    {initialUserData.website && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t('website')}
                        </h3>
                        <p className="mt-1">
                          <a href={initialUserData.website} target="_blank" rel="noopener noreferrer" className="text-pinterest-red hover:underline">
                            {initialUserData.website}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>{t('accountSecurity')}</CardTitle>
            <CardDescription>{t('managePasswordAndSecurity')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{t('changePassword')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('updateYourPassword')}
                </p>
              </div>
              <Button variant="outline">
                {t('changePassword')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
