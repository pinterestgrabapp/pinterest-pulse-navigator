
import { useState } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface KeywordData {
  keyword: string;
  frequency: number;
  trendScore: number;
  engagementScore: number;
  relatedKeywords: string[];
}

interface ProfileData {
  username: string;
  totalPins: number;
  followers: number;
  boards: number;
  topKeywords: string[];
  avgEngagement: number;
}

interface PinData {
  title: string;
  description: string;
  repins: number;
  comments: number;
  boardName: string;
  hashtags: string[];
  url: string;
}

interface AnalyticsResult {
  keywords?: KeywordData[];
  profile?: ProfileData;
  pins?: PinData[];
  insights: string;
  error?: string;
}

const PinterestAnalytics = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<'keyword' | 'pin' | 'profile'>('keyword');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  
  const runAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a keyword, pin URL, or profile URL",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the analytics feature",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('pinterest-analytics', {
        body: {
          type: searchType,
          value: searchText,
          useNlp: true,
          maxResults: 30
        }
      });
      
      if (error) throw error;
      
      setResult(data);
      
      toast({
        title: "Analysis complete",
        description: "Pinterest analytics data has been processed successfully",
      });
    } catch (error) {
      console.error("Analytics error:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not complete the Pinterest analytics request",
        variant: "destructive",
      });
      
      setResult({
        insights: "Analysis failed. Please try again later.",
        error: error.message || "Unknown error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'keyword': return 'Enter keyword (e.g., "home decor")';
      case 'pin': return 'Enter Pinterest pin URL';
      case 'profile': return 'Enter Pinterest profile URL';
      default: return 'Search...';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Pinterest Analytics Engine</h2>
        
        <form onSubmit={runAnalysis} className="space-y-4">
          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="keyword">Keyword</TabsTrigger>
              <TabsTrigger value="pin">Pin URL</TabsTrigger>
              <TabsTrigger value="profile">Profile URL</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="pr-10"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading || !searchText.trim()} 
              className="gap-2 bg-pinterest-red hover:bg-pinterest-red/80"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-pinterest-red mb-4" />
          <p className="text-gray-400">Analyzing Pinterest data...</p>
        </div>
      )}
      
      {result && !loading && (
        <div className="space-y-6">
          {/* Insights Panel */}
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle>Analytics Insights</CardTitle>
              <CardDescription>AI-generated insights from your Pinterest data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-300">{result.insights}</div>
            </CardContent>
          </Card>
          
          {/* Keywords Results */}
          {result.keywords && result.keywords.length > 0 && (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
                <CardDescription>Trend and engagement data for related keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Trend Score</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Related Keywords</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.keywords.slice(0, 15).map((keyword, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{keyword.keyword}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                keyword.trendScore > 70 
                                  ? 'bg-green-900 text-green-300' 
                                  : keyword.trendScore > 40 
                                  ? 'bg-yellow-900 text-yellow-300' 
                                  : 'bg-gray-800 text-gray-300'
                              }`}
                            >
                              {keyword.trendScore}
                            </span>
                            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  keyword.trendScore > 70 
                                    ? 'bg-green-500' 
                                    : keyword.trendScore > 40 
                                    ? 'bg-yellow-500' 
                                    : 'bg-gray-500'
                                }`}
                                style={{ width: `${keyword.trendScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{keyword.frequency}</TableCell>
                        <TableCell>{keyword.engagementScore}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {keyword.relatedKeywords.map((related, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                {related}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          {/* Profile Results */}
          {result.profile && (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Profile Analysis: @{result.profile.username}</CardTitle>
                <CardDescription>
                  {result.profile.followers} followers • {result.profile.boards} boards • {result.profile.totalPins} pins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.profile.topKeywords.map((keyword, i) => (
                      <Badge key={i} className="bg-pinterest-red/80 hover:bg-pinterest-red">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Engagement Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-900">
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold text-pinterest-red">{result.profile.avgEngagement.toFixed(1)}</p>
                        <p className="text-sm text-gray-400">Average Engagement</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-900">
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold text-pinterest-red">{result.profile.totalPins}</p>
                        <p className="text-sm text-gray-400">Total Pins</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-900">
                      <CardContent className="pt-6 text-center">
                        <p className="text-3xl font-bold text-pinterest-red">
                          {result.profile.followers > 1000 
                            ? `${(result.profile.followers / 1000).toFixed(1)}K` 
                            : result.profile.followers}
                        </p>
                        <p className="text-sm text-gray-400">Followers</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Pins Results */}
          {result.pins && result.pins.length > 0 && (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Pin Analysis</CardTitle>
                <CardDescription>
                  {searchType === 'profile' 
                    ? `Top pins from @${result.profile?.username}` 
                    : 'Pin details and metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Board</TableHead>
                      <TableHead>Repins</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Hashtags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.pins.map((pin, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          <a href={pin.url} target="_blank" rel="noopener noreferrer" className="hover:text-pinterest-red">
                            {pin.title}
                          </a>
                        </TableCell>
                        <TableCell>{pin.boardName}</TableCell>
                        <TableCell>{pin.repins}</TableCell>
                        <TableCell>{pin.comments}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pin.hashtags.slice(0, 3).map((tag, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {pin.hashtags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{pin.hashtags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          {result.error && (
            <Card className="bg-black border-red-900">
              <CardHeader>
                <CardTitle className="text-red-400">Analysis Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-red-300">{result.error}</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PinterestAnalytics;
