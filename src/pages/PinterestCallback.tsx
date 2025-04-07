
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

const PinterestCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const handlePinterestCallback = async () => {
      try {
        console.log("Pinterest callback handler started. User authenticated:", !!user);
        
        // Check if we have a user FIRST before doing anything else
        if (!user) {
          const errorMessage = "You must be logged in to connect your Pinterest account";
          console.error("Authentication error:", errorMessage);
          setError(errorMessage);
          
          // If in popup, try to message parent window
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: "PINTEREST_AUTH_ERROR",
              error: errorMessage
            }, window.location.origin);
          }
          
          setLoading(false);
          return;
        }

        // Get the code and state from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const storedState = localStorage.getItem("pinterest_auth_state");
        
        // Verify the state to prevent CSRF attacks
        if (!state || state !== storedState) {
          const errorMessage = "Invalid state parameter. This could be a security issue.";
          setError(errorMessage);
          
          // If in popup, message parent window
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: "PINTEREST_AUTH_ERROR",
              error: errorMessage
            }, window.location.origin);
          }
          
          setLoading(false);
          return;
        }

        // Clear the state from localStorage
        localStorage.removeItem("pinterest_auth_state");

        if (!code) {
          const errorMessage = "No authorization code received from Pinterest";
          setError(errorMessage);
          
          // If in popup, message parent window
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: "PINTEREST_AUTH_ERROR",
              error: errorMessage
            }, window.location.origin);
          }
          
          setLoading(false);
          return;
        }

        // Use the current window's origin for the redirect URI to match what was used in the auth request
        const redirectUri = `${window.location.origin}/pinterest-callback`;
        console.log("Using redirect URI for token exchange:", redirectUri);

        console.log("Exchanging code for token with userId:", user.id);
        
        // Call our secure Supabase Edge Function to exchange the code for tokens
        const { data, error: exchangeError } = await supabase.functions.invoke('pinterest-auth', {
          body: { 
            code, 
            userId: user.id,
            redirectUri // Pass the redirect URI to the edge function
          },
        });

        if (exchangeError) {
          console.error("Error exchanging token:", exchangeError);
          throw new Error(`Token exchange failed: ${exchangeError.message}`);
        }

        console.log("Pinterest connection successful:", data);

        // Show success message
        uiToast({
          title: "Pinterest Connected",
          description: "Your Pinterest account has been successfully connected!",
        });

        // If this page is in a popup, close it and notify the opener
        if (window.opener && !window.opener.closed) {
          window.opener.focus();
          window.opener.postMessage({
            type: "PINTEREST_AUTH_SUCCESS",
            data: { success: true, username: data?.username }
          }, window.location.origin);
          
          // Give the message time to be received before closing
          setTimeout(() => window.close(), 500);
        } else {
          // If not in a popup, redirect to settings
          navigate("/settings");
        }
      } catch (err: any) {
        console.error("Error processing Pinterest callback:", err);
        const errorMessage = `Failed to connect your Pinterest account: ${err.message}`;
        setError(errorMessage);
        
        // If in popup, still try to message the parent window
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: "PINTEREST_AUTH_ERROR",
            error: errorMessage
          }, window.location.origin);
          
          // Give the message time to be received before closing
          setTimeout(() => window.close(), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    handlePinterestCallback();
  }, [user, navigate, uiToast]);

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
