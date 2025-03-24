
import { useState } from 'react';
import { Search, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/utils/languageUtils';
import { MOCK_PIN_STATS } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PinData {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  stats: typeof MOCK_PIN_STATS;
}

export const PinAnalyzer = () => {
  const [pinUrl, setPinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinResults, setPinResults] = useState<PinData[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAnalyzePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pinUrl) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID for this result
      const id = Date.now().toString();
      
      // Mock data for the new pin
      const newPinData: PinData = {
        id,
        url: pinUrl,
        title: "Modern Interior Design Ideas for 2023",
        description: "Explore the latest trends in home decor with minimalist Scandinavian influences and sustainable materials.",
        keywords: [
          'home decor ideas', 
          'living room inspiration', 
          'minimalist design', 
          'interior styling', 
          'scandinavian interior',
          'modern home',
          'cozy space',
          'neutral colors'
        ],
        stats: MOCK_PIN_STATS
      };
      
      setPinResults(prev => [newPinData, ...prev]);
      setPinUrl('');
      
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

  const handleDownload = (pinData: PinData) => {
    // Create CSV content
    const csvContent = [
      ['URL', 'Title', 'Description', 'Keywords', 'Pin Score', 'Saves', 'Clicks', 'Impressions', 'Engagement'],
      [
        pinData.url,
        pinData.title,
        pinData.description,
        pinData.keywords.join(', '),
        pinData.stats.pinScore,
        pinData.stats.saves,
        pinData.stats.clicks,
        pinData.stats.impressions,
        `${pinData.stats.engagement}%`
      ]
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `pin-analysis-${pinData.id}.csv`);
    a.click();
    
    toast({
      title: t('copied'), // Using 'copied' instead of 'downloaded' as it's a valid key
      description: 'Pin data has been downloaded as CSV.',
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleAnalyzePin} className="w-full mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
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

      {/* Results Table */}
      {pinResults.length > 0 ? (
        <div className="rounded-md border bg-white dark:bg-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pinResults.map((pin) => (
                <TableRow key={pin.id}>
                  <TableCell className="max-w-[200px] truncate">{pin.url}</TableCell>
                  <TableCell className="font-medium">{pin.title}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{pin.description}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-wrap gap-1">
                      {pin.keywords.map((keyword, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-800 dark:text-gray-200">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(pin)}
                      title="Download data"
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
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Enter a Pinterest pin URL to analyze keywords and stats
          </p>
        </div>
      )}
    </div>
  );
};

export default PinAnalyzer;
