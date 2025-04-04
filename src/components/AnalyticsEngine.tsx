
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Link, User, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  analyzePinterest, 
  AnalyticsResult, 
  PinAnalytics,
  KeywordAnalytics,
  ProfileAnalytics
} from '@/services/analyticsService';

interface AnalyticsEngineProps {
  showTitle?: boolean;
  defaultTab?: 'pin' | 'profile' | 'keyword';
  onAnalysisComplete?: (result: AnalyticsResult) => void;
}

const AnalyticsEngine = ({ 
  showTitle = true, 
  defaultTab = 'keyword',
  onAnalysisComplete 
}: AnalyticsEngineProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [pinUrl, setPinUrl] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to use the analytics feature.',
        variant: 'destructive'
      });
      return;
    }
    
    let query = '';
    switch (activeTab) {
      case 'pin':
        query = pinUrl;
        break;
      case 'profile':
        query = profileUrl;
        break;
      case 'keyword':
        query = keyword;
        break;
    }
    
    if (!query) {
      toast({
        title: 'Input required',
        description: 'Please enter a valid URL or keyword.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const analysisResult = await analyzePinterest(activeTab, query, user.id);
      setResult(analysisResult);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
      
      toast({
        title: 'Analysis complete',
        description: `Successfully analyzed ${activeTab}: ${query}`,
      });
    } catch (error: any) {
      console.error(`Error analyzing ${activeTab}:`, error);
      toast({
        title: 'Analysis failed',
        description: error.message || `Failed to analyze ${activeTab}. Please try again.`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPinResult = (data: PinAnalytics) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/3">
          {data.image_url && (
            <img 
              src={data.image_url} 
              alt={data.title} 
              className="w-full h-auto rounded-lg border border-gray-700"
            />
          )}
        </div>
        <div className="sm:w-2/3">
          <h3 className="text-xl font-bold mb-2">{data.title}</h3>
          <p className="text-gray-400 mb-4">{data.description}</p>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-1">Engagement Score</h4>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-pinterest-red h-2.5 rounded-full" 
                style={{ width: `${data.engagement_score}%` }}
              ></div>
            </div>
            <p className="text-sm text-right mt-1">{data.engagement_score}/100</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {data.keywords.slice(0, 10).map((keyword, i) => (
                <span 
                  key={i} 
                  className="bg-gray-800 text-gray-200 px-2 py-1 rounded-full text-xs"
                >
                  {keyword.keyword} 
                  {keyword.relevance_score && <span className="ml-1 opacity-70">{keyword.relevance_score}</span>}
                </span>
              ))}
            </div>
          </div>
          
          {data.url && (
            <a 
              href={data.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pinterest-red hover:underline flex items-center gap-1 text-sm"
            >
              <Link size={14} />
              Visit Original Pin
            </a>
          )}
        </div>
      </div>
      
      {data.related_pins && data.related_pins.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Related Pins</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {data.related_pins.map((pin, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                {pin.image_url && (
                  <img 
                    src={pin.image_url} 
                    alt={pin.title} 
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-2">
                  <p className="text-xs truncate" title={pin.title}>{pin.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderKeywordResult = (data: KeywordAnalytics) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-2/3">
          <h3 className="text-xl font-bold mb-2">"{data.keyword}"</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400">Pin Count</h4>
              <p className="text-2xl font-bold">{data.pin_count}</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400">Trend Score</h4>
              <p className="text-2xl font-bold">{data.trend_score}/100</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400">Avg. Engagement</h4>
              <p className="text-2xl font-bold">{data.average_engagement}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Related Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {data.related_keywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className="bg-gray-800 text-gray-200 px-2 py-1 rounded-full text-xs"
                >
                  {keyword.keyword} 
                  {keyword.relevance_score && <span className="ml-1 opacity-70">{keyword.relevance_score}</span>}
                </span>
              ))}
            </div>
          </div>
          
          {typeof data.analysis === 'object' && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Analysis</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                {Object.entries(data.analysis).map(([key, value]) => (
                  key !== 'keywords' && (
                    <div key={key} className="mb-3">
                      <h5 className="text-sm font-medium text-gray-300 capitalize">{key.replace(/_/g, ' ')}</h5>
                      <p className="text-gray-400">{String(value)}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {typeof data.analysis === 'string' && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Analysis</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400">{data.analysis}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="sm:w-1/3">
          <h4 className="font-semibold mb-3">Sample Pins</h4>
          <div className="space-y-3">
            {data.sample_pins.map((pin, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden flex">
                {pin.image_url && (
                  <img 
                    src={pin.image_url} 
                    alt={pin.title} 
                    className="w-20 h-20 object-cover"
                  />
                )}
                <div className="p-2 flex-1">
                  <p className="text-xs font-medium line-clamp-1" title={pin.title}>{pin.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{pin.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileResult = (data: ProfileAnalytics) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/3">
          <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
            {data.profile_image && (
              <img 
                src={data.profile_image} 
                alt={data.username} 
                className="w-24 h-24 rounded-full mb-2"
              />
            )}
            <h3 className="text-xl font-bold">{data.username}</h3>
            {data.website_url && (
              <a 
                href={data.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pinterest-red hover:underline text-sm mt-1"
              >
                {data.website_url}
              </a>
            )}
            <p className="text-gray-400 mt-2">{data.pin_count} pins</p>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Top Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {data.top_keywords.slice(0, 15).map((keyword, i) => (
                <span 
                  key={i} 
                  className="bg-gray-800 text-gray-200 px-2 py-1 rounded-full text-xs"
                >
                  {keyword.keyword} 
                  {keyword.relevance_score && <span className="ml-1 opacity-70">{keyword.relevance_score}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="sm:w-2/3">
          <h4 className="font-semibold mb-3">Top Performing Pins</h4>
          <div className="space-y-3">
            {data.top_pins.map((pin, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex">
                  {pin.image_url && (
                    <img 
                      src={pin.image_url} 
                      alt={pin.title} 
                      className="w-24 h-24 object-cover"
                    />
                  )}
                  <div className="p-3 flex-1">
                    <p className="font-medium line-clamp-1">{pin.title}</p>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">{pin.description}</p>
                    <div className="flex items-center">
                      <span className="text-xs mr-2">Engagement:</span>
                      <div className="w-32 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-pinterest-red h-1.5 rounded-full" 
                          style={{ width: `${pin.engagement_score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs ml-2">{pin.engagement_score}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {typeof data.analysis === 'object' && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Profile Analysis</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                {Object.entries(data.analysis).map(([key, value]) => (
                  key !== 'top_keywords' && (
                    <div key={key} className="mb-3">
                      <h5 className="text-sm font-medium text-gray-300 capitalize">{key.replace(/_/g, ' ')}</h5>
                      <p className="text-gray-400">{String(value)}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          
          {typeof data.analysis === 'string' && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Profile Analysis</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-400">{data.analysis}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalysisResult = () => {
    if (!result) return null;
    
    switch (activeTab) {
      case 'pin':
        return renderPinResult(result as PinAnalytics);
      case 'keyword':
        return renderKeywordResult(result as KeywordAnalytics);
      case 'profile':
        return renderProfileResult(result as ProfileAnalytics);
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-xl font-bold mb-4">Pinterest Analytics Engine</h2>
      )}
      
      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle>Run Analysis</CardTitle>
          <CardDescription>
            Analyze Pinterest pins, profiles, or keywords for detailed insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={(tab: any) => setActiveTab(tab)}
            className="mb-4"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="keyword">
                <Search className="h-4 w-4 mr-2" />
                Keyword
              </TabsTrigger>
              <TabsTrigger value="pin">
                <Link className="h-4 w-4 mr-2" />
                Pin URL
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="pin" className="space-y-4">
                <div>
                  <Input
                    type="url"
                    placeholder="Enter Pinterest Pin URL"
                    value={pinUrl}
                    onChange={(e) => setPinUrl(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter Pinterest username or profile URL"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="keyword" className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter keyword to analyze"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                    disabled={isLoading}
                  />
                </div>
              </TabsContent>
              
              <div className="mt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="bg-pinterest-red text-white hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="mt-6 p-8 flex flex-col items-center justify-center bg-gray-900 rounded-lg border border-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-pinterest-red mb-2" />
          <p className="text-gray-400">Analyzing data, please wait...</p>
        </div>
      )}
      
      {!isLoading && result && (
        <Card className="mt-6 bg-black border-gray-700">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {renderAnalysisResult()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsEngine;
