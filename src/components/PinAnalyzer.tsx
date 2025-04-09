
import { useState } from 'react';
import { Search, Download, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/utils/languageUtils';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_PIN_STATS } from '@/lib/constants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { analyzeKeywords, analyzePinUrl } from '@/utils/pinterestApiUtils';
import { supabase } from '@/integrations/supabase/client';

interface PinData {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: any[];
  stats: any;
  status: 'completed' | 'pending' | 'error';
  pinScore?: number;
  insights?: string[];
}

export const PinAnalyzer = () => {
  const [pinUrl, setPinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinResults, setPinResults] = useState<PinData[]>([]);
  const [analysisType, setAnalysisType] = useState<'pin' | 'keyword'>('pin');
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  const calculatePinScore = (stats: { saves: number; clicks: number; impressions: number; engagement: number }): number => {
    // Calculate pin score based on saves, clicks, impressions, and engagement
    const saveWeight = 0.4;
    const clickWeight = 0.2;
    const impressionWeight = 0.1;
    const engagementWeight = 0.3;
    
    const normalizedSaves = stats.saves / 1000;
    const normalizedClicks = stats.clicks / 500;
    const normalizedImpressions = stats.impressions / 5000;
    const normalizedEngagement = stats.engagement / 10;
    
    const score = (
      normalizedSaves * saveWeight +
      normalizedClicks * clickWeight +
      normalizedImpressions * impressionWeight +
      normalizedEngagement * engagementWeight
    ) * 100;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  const extractPinIdFromUrl = (url: string): string | null => {
    // Pinterest URLs can have different formats, let's handle the common ones
    const patterns = [
      /pinterest\.com\/pin\/(\d+)/,  // Standard pin URL
      /pinterest\.[\w.]+\/pin\/(\d+)/,  // International domains
      /pin\.it\/(\w+)/  // Short URL format
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const savePinAnalysisToDb = async (pinData: PinData) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_scrapes')
        .insert({
          user_id: user.id,
          url: pinData.url,
          title: pinData.title,
          description: pinData.description,
          keywords: pinData.keywords,
          status: pinData.status
        });
        
      if (error) {
        console.error('Error saving pin analysis to database:', error);
        toast({
          title: 'Error',
          description: 'Failed to save the analysis results.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error in database operation:', error);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinUrl) return;
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to analyze Pinterest pins.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a unique ID for this result
      const id = Date.now().toString();
      
      // Set up a "pending" entry while we wait for the API
      const pendingPinData: PinData = {
        id,
        url: pinUrl,
        title: analysisType === 'pin' ? "Analyzing pin..." : `Analyzing keyword: ${pinUrl}`,
        description: analysisType === 'pin' ? "Fetching Pinterest pin data..." : "Searching for pins with this keyword...",
        keywords: [],
        stats: MOCK_PIN_STATS,
        status: 'pending'
      };
      
      setPinResults(prev => [pendingPinData, ...prev]);
      
      // Try to get real data using our Apify-powered functions
      try {
        let analyticsData;
        
        if (analysisType === 'pin') {
          analyticsData = await analyzePinUrl(pinUrl);
        } else {
          analyticsData = await analyzeKeywords(pinUrl);
        }
        
        if (!analyticsData || !analyticsData.data) {
          throw new Error("No data returned from analytics");
        }
        
        const data = analyticsData.data;
        
        // Process analytics data based on type
        if (analysisType === 'pin') {
          // Format pin analysis result
          const stats = {
            saves: data.metrics.saves,
            clicks: Math.floor(data.metrics.saves * 0.7), // Estimate clicks
            impressions: data.metrics.impressions,
            engagement: parseFloat(data.metrics.engagement_rate) || 5,
            createdAt: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
          
          const pinScore = calculatePinScore(stats);
          
          const updatedPinData: PinData = {
            id,
            url: pinUrl,
            title: data.title || "No title available",
            description: data.description || "No description available", 
            keywords: data.keywords || [],
            stats: stats,
            status: 'completed',
            pinScore: pinScore,
            insights: data.insights || []
          };
          
          // Update the results
          setPinResults(prev => prev.map(pin => pin.id === id ? updatedPinData : pin));
          
          // Save to database
          await savePinAnalysisToDb(updatedPinData);
        } else {
          // Format keyword analysis result
          const keywordData: PinData = {
            id,
            url: pinUrl, // The keyword is stored in the URL field
            title: `Keyword: ${pinUrl}`,
            description: `Found ${data.pins_found} pins with this keyword`,
            keywords: data.keywords || [],
            stats: {
              saves: data.avg_engagement || 0,
              clicks: Math.floor((data.avg_engagement || 0) * 0.7), // Estimate clicks
              impressions: (data.avg_engagement || 0) * 10, // Estimate impressions
              engagement: data.avg_engagement ? ((data.avg_engagement / 100) * 10) : 0,
              createdAt: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            },
            status: 'completed',
            pinScore: data.keywords && data.keywords[0] ? data.keywords[0].trend_score : 50,
            insights: data.insights || []
          };
          
          // Update the results
          setPinResults(prev => prev.map(pin => pin.id === id ? keywordData : pin));
          
          // Save to database
          await savePinAnalysisToDb(keywordData);
        }
        
        toast({
          title: analysisType === 'pin' ? 'Pin Analysis Complete' : 'Keyword Analysis Complete',
          description: 'Successfully extracted analytics data.'
        });
      } catch (error) {
        console.error('Error analyzing:', error);
        
        // Update the entry to show error
        setPinResults(prev => prev.map(pin => {
          if (pin.id === id) {
            return {
              ...pin,
              title: "Analysis Failed",
              description: `Could not retrieve ${analysisType === 'pin' ? 'pin' : 'keyword'} data from Pinterest.`,
              keywords: ['error', 'failed'],
              status: 'error'
            };
          }
          return pin;
        }));
        
        toast({
          title: 'Error',
          description: `Failed to analyze the Pinterest ${analysisType === 'pin' ? 'pin' : 'keyword'}. Please try again later.`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error in analysis flow:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setPinUrl('');
    }
  };

  const handleDownload = (pinData: PinData) => {
    // Create CSV content
    const csvContent = [
      ['URL', 'Title', 'Description', 'Keywords', 'Pin Score', 'Saves', 'Clicks', 'Impressions', 'Engagement', 'Status'], 
      [
        pinData.url, 
        pinData.title, 
        pinData.description, 
        pinData.keywords.map(k => k.keyword || k).join(', '), 
        pinData.pinScore || 'N/A', 
        pinData.stats.saves, 
        pinData.stats.clicks, 
        pinData.stats.impressions, 
        `${pinData.stats.engagement}%`, 
        pinData.status
      ]
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${analysisType}-analysis-${pinData.id}.csv`);
    a.click();
    toast({
      title: t('copied'),
      description: `${analysisType === 'pin' ? 'Pin' : 'Keyword'} data has been downloaded as CSV.`
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleAnalyze} className="w-full mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant={analysisType === 'pin' ? "default" : "outline"}
              onClick={() => setAnalysisType('pin')}
              className={analysisType === 'pin' ? "bg-pinterest-red text-white" : ""}
            >
              Analyze Pin
            </Button>
            <Button 
              type="button" 
              variant={analysisType === 'keyword' ? "default" : "outline"}
              onClick={() => setAnalysisType('keyword')}
              className={analysisType === 'keyword' ? "bg-pinterest-red text-white" : ""}
            >
              Analyze Keyword
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input 
                type="text" 
                placeholder={analysisType === 'pin' 
                  ? t('enterPinUrl') 
                  : "Enter a keyword to analyze"
                } 
                value={pinUrl} 
                onChange={e => setPinUrl(e.target.value)} 
                className="pr-10" 
                required 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {analysisType === 'pin' ? (
                  <Search className="h-4 w-4 text-gray-400" />
                ) : (
                  <Sparkles className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !pinUrl} 
              className="gap-2 text-white bg-pinterest-red"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  {analysisType === 'pin' ? t('analyze') : 'Analyze Keyword'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Results Table */}
      {pinResults.length > 0 ? (
        <div className="rounded-md border bg-black text-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{analysisType === 'pin' ? 'URL' : 'Keyword'}</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>{analysisType === 'pin' ? 'Pin Score' : 'Trend Score'}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pinResults.map(pin => (
                <TableRow key={pin.id}>
                  <TableCell className="max-w-[200px] truncate">{pin.url}</TableCell>
                  <TableCell className="font-medium">{pin.title}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{pin.description}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-wrap gap-1">
                      {pin.keywords.map((keyword, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-200">
                          {keyword.keyword || keyword}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {pin.status === 'pending' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : pin.status === 'error' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-900 text-red-200 text-xs">
                        Error
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-pinterest-red text-white text-xs font-bold">
                        {pin.pinScore || 'N/A'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      pin.status === 'completed' 
                        ? 'bg-green-900 text-green-200' 
                        : pin.status === 'error'
                        ? 'bg-red-900 text-red-200'
                        : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {pin.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(pin)} 
                      title="Download data"
                      disabled={pin.status === 'pending'}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 bg-black text-white rounded-lg border border-gray-800">
          <p className="text-gray-400">
            {analysisType === 'pin' ? 
              'Enter a Pinterest pin URL to analyze keywords and stats' : 
              'Enter a keyword to analyze Pinterest trends and engagement'
            }
          </p>
        </div>
      )}

      {/* Insights section */}
      {pinResults.length > 0 && pinResults[0].insights && pinResults[0].status === 'completed' && (
        <div className="mt-6 p-4 bg-black border border-gray-800 rounded-md">
          <h3 className="text-lg font-semibold text-white mb-2">Analytics Insights</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {pinResults[0].insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PinAnalyzer;
