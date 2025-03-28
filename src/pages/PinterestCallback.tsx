
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
          setError("Invalid state parameter. This could be a security issue.");
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

        // Call our secure Supabase Edge Function to exchange the code for tokens
        const { error: exchangeError } = await supabase.functions.invoke('pinterest-auth', {
          body: { code },
        });

        if (exchangeError) {
          throw new Error(`Token exchange failed: ${exchangeError.message}`);
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
