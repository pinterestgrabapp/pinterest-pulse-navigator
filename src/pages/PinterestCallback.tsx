
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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
        const { data, error: exchangeError } = await supabase.functions.invoke('pinterest-auth', {
          body: { 
            code, 
            userId: user.id 
          },
        });

        if (exchangeError) {
          console.error("Error exchanging token:", exchangeError);
          throw new Error(`Token exchange failed: ${exchangeError.message}`);
        }

        console.log("Pinterest connection response:", data);

        toast({
          title: "Pinterest Connected",
          description: "Your Pinterest account has been successfully connected!",
        });

        // Close the popup if this page is in a popup
        if (window.opener && !window.opener.closed) {
          window.opener.focus();
          // Optional: pass data back to opener
          window.opener.postMessage({
            type: "PINTEREST_AUTH_SUCCESS",
            data: { success: true }
          }, window.location.origin);
          window.close();
        } else {
          // If not in a popup, redirect to settings
          navigate("/settings");
        }
      } catch (err: any) {
        console.error("Error processing Pinterest callback:", err);
        setError(`Failed to connect your Pinterest account: ${err.message}`);
        
        // If in popup, still try to close it after showing the error
        setTimeout(() => {
          if (window.opener && !window.opener.closed) {
            window.opener.focus();
            window.opener.postMessage({
              type: "PINTEREST_AUTH_ERROR",
              error: err.message
            }, window.location.origin);
            window.close();
          }
        }, 4000); // Give some time to see the error
      } finally {
        setLoading(false);
      }
    };

    handlePinterestCallback();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Connecting to Pinterest...</h1>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
        <div className="text-center max-w-md mx-auto p-6 bg-black border border-gray-800 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Connection Error</h1>
          <p className="mb-6 text-gray-300">{error}</p>
          <button
            onClick={() => {
              if (window.opener && !window.opener.closed) {
                window.close(); // Close popup if in popup
              } else {
                navigate("/settings"); // Navigate if not in popup
              }
            }}
            className="btn-dreamy px-4 py-2 rounded-lg bg-pinterest-red text-white"
          >
            {window.opener ? "Close Window" : "Return to Settings"}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PinterestCallback;
