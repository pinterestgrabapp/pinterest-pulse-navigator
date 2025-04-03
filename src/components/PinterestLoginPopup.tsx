
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/utils/languageUtils";

interface PinterestLoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (username: string) => void;
}

const PinterestLoginPopup = ({ open, onOpenChange, onSuccess }: PinterestLoginPopupProps) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setUsername("");
      setPassword("");
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate a connection (in a real app, this would be a secure OAuth flow)
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, we'll simulate a successful connection
      // In a real app, this would verify credentials via OAuth
      if (username.trim().length > 0) {
        onSuccess(username);
        onOpenChange(false);
      } else {
        setError("Please enter a valid Pinterest username");
      }
    }, 1500);
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
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="pinterest-username" className="text-sm font-medium">
              Pinterest Username
            </label>
            <input
              id="pinterest-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              placeholder="Your Pinterest username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="pinterest-password" className="text-sm font-medium">
              Pinterest Password
            </label>
            <input
              id="pinterest-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              placeholder="Your Pinterest password"
              required
            />
            <p className="text-xs text-gray-500">
              Your credentials are only used to connect your account and are not stored.
            </p>
          </div>
          
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
              type="submit" 
              className="bg-pinterest-red" 
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinterestLoginPopup;
