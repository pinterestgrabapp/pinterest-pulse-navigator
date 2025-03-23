
import { useState } from 'react';
import { Search, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/utils/languageUtils';
import { MOCK_PIN_STATS } from '@/lib/constants';

export const PinAnalyzer = () => {
  const [pinUrl, setPinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [pinStats, setPinStats] = useState<typeof MOCK_PIN_STATS | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAnalyzePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pinUrl) return;
    
    setIsLoading(true);
    setKeywords([]);
    setPinStats(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock keywords extraction
      const mockKeywords = [
        'home decor ideas', 
        'living room inspiration', 
        'minimalist design', 
        'interior styling', 
        'scandinavian interior',
        'modern home',
        'cozy space',
        'neutral colors'
      ];
      
      setKeywords(mockKeywords);
      setPinStats(MOCK_PIN_STATS);
      
      toast({
        title: 'Pin Analysis Complete',
        description: 'Successfully extracted keywords and pin statistics.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze the Pinterest pin.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMoreKeywords = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Add more mock keywords
      const additionalKeywords = [
        'budget friendly decor', 
        'DIY home projects', 
        'small space solutions', 
        'apartment decor', 
        'home organization'
      ];
      
      setKeywords(prev => [...prev, ...additionalKeywords]);
      setIsLoading(false);
      
      toast({
        title: 'Keywords Generated',
        description: 'Successfully generated additional keywords.',
      });
    }, 1000);
  };

  const copyToClipboard = () => {
    if (keywords.length === 0) return;
    
    navigator.clipboard.writeText(keywords.join(', '));
    setHasCopied(true);
    
    toast({
      title: t('copied'),
      description: 'Keywords copied to clipboard.',
    });
    
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <form onSubmit={handleAnalyzePin} className="w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="url"
              placeholder={t('enterPinUrl')}
              value={pinUrl}
              onChange={(e) => setPinUrl(e.target.value)}
              className="pr-10"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !pinUrl}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('analyze')
            )}
          </Button>
        </div>
      </form>

      {/* Results Section */}
      {keywords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Keywords Card */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                {t('keywordsExtracted')}
              </CardTitle>
              <CardDescription>
                Keywords and hashtags found in this pin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="py-1 px-3">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={generateMoreKeywords}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  {t('generateKeywords')}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="gap-2"
                  onClick={copyToClipboard}
                >
                  {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {hasCopied ? t('copied') : t('copyToClipboard')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pin Stats Card */}
          {pinStats && (
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">
                  {t('pinScore')}
                </CardTitle>
                <CardDescription>
                  Performance analytics for this pin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r from-pinterest-red to-red-400 text-white">
                    <span className="text-2xl font-bold">{pinStats.pinScore}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">{t('saves')}</span>
                    <span className="font-medium">{pinStats.saves.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">{t('clicks')}</span>
                    <span className="font-medium">{pinStats.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">{t('impressions')}</span>
                    <span className="font-medium">{pinStats.impressions.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400">{t('engagement')}</span>
                    <span className="font-medium">{pinStats.engagement}%</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">{t('createdAt')}</span>
                    <span className="font-medium">{pinStats.createdAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Empty State */}
      {!keywords.length && !isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            Enter a Pinterest pin URL to analyze keywords and stats
          </p>
        </div>
      )}
    </div>
  );
};

export default PinAnalyzer;
