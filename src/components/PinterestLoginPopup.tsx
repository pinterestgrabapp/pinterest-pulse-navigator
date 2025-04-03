
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/utils/languageUtils";
import { openPinterestAuthPopup } from "@/utils/pinterestApiUtils";
import { toast } from "sonner";

interface PinterestLoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (username: string) => void;
}

const PinterestLoginPopup = ({ open, onOpenChange, onSuccess }: PinterestLoginPopupProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    // Set up event listener for the Pinterest OAuth popup response
    const handlePinterestAuthMessage = (event: MessageEvent) => {
      // Only process messages from our own origin
      if (event.origin !== window.location.origin) return;
      
      // Check if this is our Pinterest auth message
      if (event.data?.type === "PINTEREST_AUTH_SUCCESS" && event.data?.data) {
        console.log("Received successful Pinterest auth response:", event.data);
        onSuccess(event.data.data.username || "Pinterest User");
        onOpenChange(false);
      } else if (event.data?.type === "PINTEREST_AUTH_ERROR") {
        console.error("Pinterest auth error:", event.data.error);
        setError(event.data.error || "Failed to connect Pinterest account");
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handlePinterestAuthMessage);
    
    return () => {
      window.removeEventListener("message", handlePinterestAuthMessage);
    };
  }, [onSuccess, onOpenChange]);

  const handleConnectPinterest = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Open the Pinterest OAuth popup
      const popup = openPinterestAuthPopup();
      
      if (!popup) {
        setError("Pinterest popup was blocked. Please allow popups for this site.");
        setIsLoading(false);
        return;
      }
      
      // The response will be handled by the event listener
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // If no response received but popup closed, consider it canceled
          setIsLoading(false);
        }
      }, 500);
      
    } catch (err: any) {
      console.error("Error opening Pinterest auth:", err);
      setError("Failed to open Pinterest authentication. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Pinterest Account</DialogTitle>
          <DialogDescription>
            Connect your personal Pinterest account to enable Pinterest features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Clicking the button below will open a Pinterest authentication window where you can authorize access to your account.
          </p>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-pinterest-red" 
              onClick={handleConnectPinterest}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect with Pinterest"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinterestLoginPopup;
