
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { hasRapidApiKey } from "@/utils/pinterestApiUtils";
import { ExternalLink, Key, LucideCheck } from "lucide-react";

export default function RapidApiKeyForm() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  // Check if API key is already configured
  useEffect(() => {
    const checkApiKey = async () => {
      const hasKey = await hasRapidApiKey();
      setIsConfigured(hasKey);
    };
    
    checkApiKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Store the API key in Supabase edge function secrets
      const { error } = await supabase.functions.invoke("set-rapidapi-key", {
        body: { key: apiKey.trim() }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to save API key: " + error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Your RapidAPI key has been saved.",
        variant: "default"
      });
      
      setIsConfigured(true);
      setApiKey("");
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      console.error("Error saving RapidAPI key:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyApiKey = async () => {
    setIsVerifying(true);
    
    try {
      const hasKey = await hasRapidApiKey();
      
      if (hasKey) {
        toast({
          title: "Success",
          description: "Your RapidAPI key is valid and working.",
          variant: "default"
        });
        setIsConfigured(true);
      } else {
        toast({
          title: "Not Configured",
          description: "No valid RapidAPI key was found.",
          variant: "destructive"
        });
        setIsConfigured(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to verify API key.",
        variant: "destructive"
      });
      console.error("Error verifying RapidAPI key:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key size={18} />
          RapidAPI Pinterest Scraper
        </CardTitle>
        <CardDescription>
          Configure your RapidAPI key to access Pinterest data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isConfigured ? (
          <Alert className="bg-green-950 border-green-700">
            <LucideCheck className="h-4 w-4 text-green-500" />
            <AlertDescription>
              RapidAPI key is configured and ready to use
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm mb-2 text-gray-400">
                Enter your RapidAPI key for the Pinterest Scraper API
              </p>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your RapidAPI Key"
                className="bg-gray-900 border-gray-700"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                type="submit" 
                disabled={!apiKey || isLoading}
                className="bg-pinterest-red hover:bg-pinterest-red/80"
              >
                {isLoading ? "Saving..." : "Save API Key"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={verifyApiKey}
                disabled={isVerifying}
                className="border-gray-700"
              >
                {isVerifying ? "Checking..." : "Verify Connection"}
              </Button>
            </div>
            
            <p className="text-xs text-gray-400">
              Don't have a RapidAPI key?{" "}
              <a 
                href="https://rapidapi.com/replo-replo-default/api/pinterest-scraper/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pinterest-red hover:underline inline-flex items-center gap-1"
              >
                Get one here <ExternalLink size={12} />
              </a>
            </p>
          </form>
        )}
      </CardContent>
      
      {isConfigured && (
        <CardFooter className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={verifyApiKey}
            disabled={isVerifying}
            className="border-gray-700"
          >
            {isVerifying ? "Checking..." : "Verify Connection"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
