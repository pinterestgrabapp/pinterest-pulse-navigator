
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  usePinterestApi, 
  getPinterestAccessToken, 
  getPinterestUserProfile 
} from '@/utils/pinterestApiUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link } from 'lucide-react';

export const PinterestConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const { user } = useAuth();
  const { connectPinterest } = usePinterestApi();
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const accessToken = await getPinterestAccessToken(user.id);
        
        if (accessToken) {
          setIsConnected(true);
          
          // Get user profile information
          const profile = await getPinterestUserProfile(accessToken);
          setProfileData(profile);
        }
      } catch (error) {
        console.error('Error checking Pinterest connection:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, [user]);

  const handleConnect = () => {
    connectPinterest();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-pinterest-red" />
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6 shadow-lg hover:shadow-[0_0_15px_rgba(230,0,35,0.5)] transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 text-white glow-text">Pinterest Integration</h3>
      
      {isConnected ? (
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-md">
            <h4 className="font-medium text-white mb-2">Connected Account</h4>
            {profileData && (
              <div className="flex items-center space-x-4">
                {profileData.profile_image && (
                  <img 
                    src={profileData.profile_image} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full" 
                  />
                )}
                <div>
                  <p className="text-white font-medium">{profileData.username}</p>
                  <p className="text-gray-400 text-sm">{profileData.email}</p>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-pinterest-red text-pinterest-red hover:bg-pinterest-red hover:text-white animate-glow-pulse"
          >
            <Link className="h-4 w-4 mr-2" />
            Manage Connection
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300">
            Connect your Pinterest account to sync pins, analyze performance, and publish content directly.
          </p>
          
          <Button 
            onClick={handleConnect} 
            className="w-full bg-pinterest-red hover:bg-pinterest-dark text-white animate-glow-pulse"
          >
            Connect Pinterest Account
          </Button>
        </div>
      )}
    </div>
  );
};

export default PinterestConnect;
