import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PinterestCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handlePinterestCallback = async () => {
      if (!user) {
        setError("You must be logged in to connect your Pinterest account");
        setLoading(false);
        return;
      }

      try {
        // Get the code and state from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const storedState = localStorage.getItem("pinterest_auth_state");

        // Verify the state to prevent CSRF attacks
        if (!state || state !== storedState) {
          setError("Invalid state parameter");
          setLoading(false);
          return;
        }

        // Clear the state from localStorage
        localStorage.removeItem("pinterest_auth_state");

        if (!code) {
          setError("No authorization code received from Pinterest");
          setLoading(false);
          return;
        }

        // In a real application, we would use a secure backend to exchange the code for an access token
        // For demonstration purposes, we'll simulate this step
        // Note: This should be done on your server using an Edge Function to keep your app secret secure
        
        // Simulate token exchange
        const simulatedTokenData = {
          access_token: "simulated_access_token", // In a real app, this comes from Pinterest API
          refresh_token: "simulated_refresh_token", // In a real app, this comes from Pinterest API
          expires_in: 3600 // 1 hour expiration
        };

        // Calculate expiration date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + simulatedTokenData.expires_in);

        // Store the credentials in Supabase
        const { error: supabaseError } = await supabase
          .from("pinterest_credentials")
          .upsert({
            user_id: user.id,
            access_token: simulatedTokenData.access_token,
            refresh_token: simulatedTokenData.refresh_token,
            expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (supabaseError) {
          throw supabaseError;
        }

        toast({
          title: "Pinterest Connected",
          description: "Your Pinterest account has been successfully connected!",
        });

        // Redirect to settings or dashboard
        navigate("/settings");
      } catch (err) {
        console.error("Error processing Pinterest callback:", err);
        setError("Failed to connect your Pinterest account. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handlePinterestCallback();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 glow-text">Connecting to Pinterest...</h1>
          <div className="animate-pulse flex space-x-4">
            <div className="h-3 w-3 bg-pinterest-red rounded-full"></div>
            <div className="h-3 w-3 bg-pinterest-red rounded-full"></div>
            <div className="h-3 w-3 bg-pinterest-red rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Connection Error</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => navigate("/settings")}
            className="btn-dreamy px-4 py-2 rounded-lg"
          >
            Return to Settings
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PinterestCallback;
