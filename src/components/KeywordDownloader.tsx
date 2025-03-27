
import { useState, useEffect } from 'react';
import { Search, Download, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const KeywordDownloader = () => {
  const [pinUrl, setPinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load search count from localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      const storedCount = localStorage.getItem('guestSearchCount');
      if (storedCount) {
        setSearchCount(parseInt(storedCount, 10));
      }
    }
  }, [user]);

  const mockKeywords = [
    'home decor', 'minimalist design', 'scandinavian interior', 
    'living room ideas', 'modern furniture', 'small space solutions',
    'neutral colors', 'cozy home', 'budget decoration', 'DIY projects'
  ];

  const isValidPinterestUrl = (url: string) => {
    return url.includes('pinterest.com/pin/') || url.includes('pin.it/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the URL
    if (!pinUrl) {
      toast({
        title: "Error",
        description: "Please enter a Pinterest URL",
        variant: "destructive"
      });
      return;
    }
    
    if (!isValidPinterestUrl(pinUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid Pinterest URL",
        variant: "destructive"
      });
      return;
    }

    // For non-authenticated users, check search limit
    if (!user) {
      const newSearchCount = searchCount + 1;
      
      if (newSearchCount > 2) {
        toast({
          title: "Search limit reached",
          description: "Please sign up to perform more searches",
          variant: "destructive"
        });
        
        // Show sign up prompt after a delay
        setTimeout(() => {
          if (window.confirm("You've reached the guest search limit. Would you like to sign up for free to continue?")) {
            navigate('/auth');
          }
        }, 1000);
        
        return;
      }
      
      // Update search count in state and localStorage
      setSearchCount(newSearchCount);
      localStorage.setItem('guestSearchCount', newSearchCount.toString());
    }
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Shuffle the mock keywords array to get random keywords each time
      const shuffled = [...mockKeywords].sort(() => 0.5 - Math.random());
      const selectedKeywords = shuffled.slice(0, 5 + Math.floor(Math.random() * 5));
      
      setKeywords(selectedKeywords);
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "Keywords extracted successfully!"
      });
      
      setPinUrl('');
    }, 1500);
  };

  const handleDownload = () => {
    // Create a CSV string with the keywords
    const csvContent = "data:text/csv;charset=utf-8," + keywords.join(",");
    
    // Create a download link and trigger it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pinterest_keywords.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "Keywords have been downloaded successfully!"
    });
  };

  const remainingSearches = user ? '∞' : (2 - searchCount);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-black p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="url"
              placeholder="Enter Pinterest pin URL (e.g., https://pinterest.com/pin/...)"
              value={pinUrl}
              onChange={(e) => setPinUrl(e.target.value)}
              className="pr-10 text-black dark:text-white"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !pinUrl} 
            className="bg-pinterest-red hover:bg-pinterest-dark text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Extract Keywords'
            )}
          </Button>
        </div>
        
        {!user && (
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            <span>Guest mode: {remainingSearches} searches remaining. <Button variant="link" className="p-0 h-auto text-pinterest-red" onClick={() => navigate('/auth')}>Sign up</Button> for unlimited searches.</span>
          </div>
        )}
      </form>

      {keywords.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Extracted Keywords</h3>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm"
              className="text-pinterest-red hover:text-pinterest-dark"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordDownloader;
