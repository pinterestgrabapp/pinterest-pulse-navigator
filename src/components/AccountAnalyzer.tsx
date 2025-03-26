
import { useState } from 'react';
import { Search, Download, Loader2, ExternalLink, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";

interface PinInterest {
  name: string;
  probability: number;
}

interface PinData {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  saves: number;
  comments: number;
  clicks: number;
  impressions: number;
  pinScore: number;
  interests: PinInterest[];
}

interface AccountData {
  id: string;
  username: string;
  displayName: string;
  followers: number;
  following: number;
  boards: number;
  pins: number;
  monthlyViews: number;
  topPins: PinData[];
}

// Mock data for the account analysis
const mockAccountData: AccountData = {
  id: '1',
  username: 'interiordesignpro',
  displayName: 'Interior Design Pro',
  followers: 34567,
  following: 245,
  boards: 32,
  pins: 587,
  monthlyViews: 256000,
  topPins: [
    {
      id: '1',
      url: 'https://pinterest.com/pin/12345',
      title: 'Minimalist Scandinavian Living Room Ideas',
      thumbnail: 'https://via.placeholder.com/200x300',
      saves: 1245,
      comments: 32,
      clicks: 756,
      impressions: 15678,
      pinScore: 87.5,
      interests: [
        { name: 'scandinavian interior', probability: 0.95 },
        { name: 'minimalist home', probability: 0.89 },
        { name: 'living room decor', probability: 0.82 },
        { name: 'neutral colors', probability: 0.78 },
        { name: 'modern home design', probability: 0.75 },
      ]
    },
    {
      id: '2',
      url: 'https://pinterest.com/pin/67890',
      title: 'Cozy Bohemian Bedroom Decor',
      thumbnail: 'https://via.placeholder.com/200x300',
      saves: 876,
      comments: 24,
      clicks: 543,
      impressions: 10432,
      pinScore: 72.8,
      interests: [
        { name: 'bohemian bedroom', probability: 0.93 },
        { name: 'cozy decor', probability: 0.87 },
        { name: 'bedroom design', probability: 0.85 },
        { name: 'home inspiration', probability: 0.79 },
        { name: 'boho style', probability: 0.76 },
      ]
    },
    {
      id: '3',
      url: 'https://pinterest.com/pin/54321',
      title: 'Modern Kitchen Design Ideas',
      thumbnail: 'https://via.placeholder.com/200x300',
      saves: 934,
      comments: 18,
      clicks: 621,
      impressions: 12567,
      pinScore: 79.3,
      interests: [
        { name: 'modern kitchen', probability: 0.94 },
        { name: 'kitchen ideas', probability: 0.91 },
        { name: 'home renovation', probability: 0.84 },
        { name: 'kitchen design', probability: 0.82 },
        { name: 'interior decor', probability: 0.76 },
      ]
    },
    {
      id: '4',
      url: 'https://pinterest.com/pin/98765',
      title: 'Small Space Office Solutions',
      thumbnail: 'https://via.placeholder.com/200x300',
      saves: 765,
      comments: 15,
      clicks: 489,
      impressions: 9876,
      pinScore: 68.9,
      interests: [
        { name: 'home office', probability: 0.92 },
        { name: 'small space design', probability: 0.88 },
        { name: 'workspace ideas', probability: 0.85 },
        { name: 'productivity', probability: 0.75 },
        { name: 'interior design', probability: 0.72 },
      ]
    }
  ]
};

export const AccountAnalyzer = () => {
  const [accountUrl, setAccountUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [savedPins, setSavedPins] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAnalyzeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountUrl) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, we would fetch actual data from the server
      setAccountData(mockAccountData);
      setIsLoading(false);
      
      toast({
        title: 'Account Analysis Complete',
        description: `Successfully analyzed Pinterest account: ${mockAccountData.displayName}`
      });
    }, 2000);
  };

  const handleSavePin = (pinId: string) => {
    if (savedPins.includes(pinId)) {
      setSavedPins(prev => prev.filter(id => id !== pinId));
      toast({
        title: 'Pin Removed',
        description: 'Pin has been removed from your saved collection.'
      });
    } else {
      setSavedPins(prev => [...prev, pinId]);
      toast({
        title: 'Pin Saved',
        description: 'Pin has been added to your saved collection.'
      });
    }
  };

  const handleExportInterests = () => {
    if (!accountData) return;
    
    // Collect all unique interests from all pins
    const allInterests = accountData.topPins.flatMap(pin => 
      pin.interests.map(interest => ({ 
        pinTitle: pin.title,
        interest: interest.name,
        probability: interest.probability
      }))
    );
    
    // Create CSV content
    const csvContent = [
      ['Pin Title', 'Interest', 'Probability'],
      ...allInterests.map(item => [
        item.pinTitle,
        item.interest,
        item.probability.toFixed(2)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `pinterest-interests-${Date.now()}.csv`);
    a.click();
    
    toast({
      title: 'Interests Exported',
      description: 'All Pinterest interests have been exported to CSV.'
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleAnalyzeAccount} className="w-full mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input 
              type="url" 
              placeholder="Enter Pinterest account URL..." 
              value={accountUrl} 
              onChange={e => setAccountUrl(e.target.value)} 
              className="pr-10" 
              required 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !accountUrl} 
            className="gap-2 text-white bg-pinterest-red"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : 'Analyze Account'}
          </Button>
        </div>
      </form>

      {accountData ? (
        <div className="space-y-6">
          <Card className="bg-black text-white border-gray-700">
            <CardHeader>
              <CardTitle>{accountData.displayName}</CardTitle>
              <CardDescription className="text-gray-400">
                @{accountData.username}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Followers</p>
                  <p className="text-xl font-bold">{accountData.followers.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Following</p>
                  <p className="text-xl font-bold">{accountData.following.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Pins</p>
                  <p className="text-xl font-bold">{accountData.pins.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Monthly Views</p>
                  <p className="text-xl font-bold">{accountData.monthlyViews.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={handleExportInterests}
                  className="gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Export All Interests
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Top Performing Pins</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accountData.topPins.map(pin => (
                <div key={pin.id} className="bg-black text-white border border-gray-700 rounded-lg overflow-hidden hover:border-pinterest-red transition-colors">
                  <div className="h-40 bg-gray-800 relative">
                    <img 
                      src={pin.thumbnail} 
                      alt={pin.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        onClick={() => window.open(pin.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 ${
                          savedPins.includes(pin.id) ? 'text-yellow-400' : 'text-white'
                        }`}
                        onClick={() => handleSavePin(pin.id)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{pin.title}</h4>
                      <span className="flex items-center justify-center bg-pinterest-red text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                        {pin.pinScore}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pin.interests.slice(0, 3).map((interest, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-200">
                          {interest.name}
                        </span>
                      ))}
                      {pin.interests.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-200">
                          +{pin.interests.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-400">
                      <div className="text-center">
                        <p>{pin.saves}</p>
                        <p>Saves</p>
                      </div>
                      <div className="text-center">
                        <p>{pin.clicks}</p>
                        <p>Clicks</p>
                      </div>
                      <div className="text-center">
                        <p>{pin.impressions}</p>
                        <p>Views</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-black text-white rounded-lg border border-gray-800">
          <p className="text-gray-400">
            Enter a Pinterest account URL to analyze its performance and extract interests.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will show you top-performing pins, interest annotations, and keyword opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountAnalyzer;
