
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { savePinterestCredentials } from '@/utils/pinterestApiUtils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const PinterestCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received from Pinterest');
        }
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Exchange authorization code for access token (this would be done in a secure backend)
        // For now, we'll use a Supabase Edge Function
        const response = await fetch('/api/pinterest-exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to exchange authorization code for access token');
        }
        
        const { access_token } = await response.json();
        
        // Save the access token to Supabase
        await savePinterestCredentials(access_token, user.id);
        
        toast({
          title: 'Pinterest Connected',
          description: 'Your Pinterest account has been successfully connected.',
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Pinterest callback error:', error);
        setError(error.message || 'Failed to connect Pinterest account');
        toast({
          title: 'Connection Failed',
          description: error.message || 'Failed to connect Pinterest account',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    handleCallback();
  }, [user, navigate, toast]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-glow-pulse">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold glow-text">Pinterest Integration</h2>
          {isLoading ? (
            <div className="mt-8 space-y-4">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-pinterest-red" />
              <p>Connecting your Pinterest account...</p>
            </div>
          ) : error ? (
            <div className="mt-8 space-y-4">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 bg-pinterest-red text-white rounded-md hover:bg-pinterest-dark animate-glow-pulse"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <p className="text-green-500">Connected successfully!</p>
              <p>Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinterestCallback;
