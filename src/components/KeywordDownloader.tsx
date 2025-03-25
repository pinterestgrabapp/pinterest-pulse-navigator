
import { useState, useEffect } from 'react';
import { Search, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: 'Low' | 'Medium' | 'High';
  trending: boolean;
}

export const KeywordDownloader = () => {
  const [pinUrl, setPinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pinCount, setPinCount] = useState(0);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [guestId, setGuestId] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize a guest ID if the user is not logged in
  useEffect(() => {
    if (!user) {
      const storedGuestId = localStorage.getItem('guestId');
      if (storedGuestId) {
        setGuestId(storedGuestId);
      } else {
        const newGuestId = uuidv4();
        localStorage.setItem('guestId', newGuestId);
        setGuestId(newGuestId);
      }
    }
  }, [user]);

  // Load guest pin count
  useEffect(() => {
    if (!user && guestId) {
      const fetchPinCount = async () => {
        try {
          const { data, error } = await supabase
            .from('pin_limits')
            .select('pin_count')
            .eq('guest_id', guestId)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setPinCount(data.pin_count);
          } else {
            // Create a new record for this guest
            await supabase
              .from('pin_limits')
              .insert({ guest_id: guestId, pin_count: 0 });
          }
        } catch (error) {
          console.error('Error fetching pin count:', error);
        }
      };
      
      fetchPinCount();
    }
  }, [guestId, user]);

  // Generate mock keywords based on the URL
  const generateMockKeywords = (url: string): KeywordData[] => {
    const baseKeywords = [
      'pinterest marketing', 'social media', 'content creation',
      'seo tips', 'digital marketing', 'pinterest strategy',
      'keyword research', 'pinterest ideas', 'pinterest inspiration',
      'social media tips', 'pinterest for business', 'pinterest growth'
    ];
    
    // Extract any interesting terms from the URL
    const urlTerms = url.toLowerCase()
      .replace(/https?:\/\/(www\.)?pinterest\.com\/pin\//, '')
      .replace(/[^a-z0-9]/g, ' ')
      .split(' ')
      .filter(term => term.length > 3);
    
    // Create a mix of base keywords and URL-specific terms
    const allPossibleKeywords = [
      ...baseKeywords,
      ...urlTerms,
      ...urlTerms.map(term => `${term} ideas`),
      ...urlTerms.map(term => `${term} tips`),
      ...urlTerms.map(term => `best ${term}`),
    ];
    
    // Select a random subset
    const selectedKeywords = [];
    const keywordCount = Math.min(10, allPossibleKeywords.length);
    
    for (let i = 0; i < keywordCount; i++) {
      const randomIndex = Math.floor(Math.random() * allPossibleKeywords.length);
      const keyword = allPossibleKeywords[randomIndex];
      
      selectedKeywords.push({
        keyword,
        volume: Math.floor(Math.random() * 10000),
        difficulty: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        trending: Math.random() > 0.7,
      });
      
      // Remove to avoid duplicates
      allPossibleKeywords.splice(randomIndex, 1);
    }
    
    return selectedKeywords;
  };

  const handleDownload = () => {
    if (!keywords.length) return;
    
    // Create CSV content
    const csvContent = [
      ['Keyword', 'Volume', 'Difficulty', 'Trending'].join(','),
      ...keywords.map(kw => 
        [kw.keyword, kw.volume, kw.difficulty, kw.trending ? 'Yes' : 'No'].join(',')
      )
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'pinterest_keywords.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAnalyze = async () => {
    if (!pinUrl.includes('pinterest.com/pin/')) {
      toast({
        title: "Invalid Pinterest URL",
        description: "Please enter a valid Pinterest pin URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For non-logged in users, check if they've exceeded the limit
      if (!user) {
        if (pinCount >= 2) {
          setShowSignupDialog(true);
          setIsLoading(false);
          return;
        }
        
        // Update the pin count for this guest
        const { error } = await supabase
          .from('pin_limits')
          .upsert({ 
            guest_id: guestId, 
            pin_count: pinCount + 1 
          });
          
        if (error) throw error;
        
        setPinCount(prev => prev + 1);
      }
      
      // Simulate API call
      setTimeout(() => {
        setKeywords(generateMockKeywords(pinUrl));
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error analyzing pin:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to analyze the Pinterest pin",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Paste Pinterest URL (e.g., https://pinterest.com/pin/123456789)"
            value={pinUrl}
            onChange={(e) => setPinUrl(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={handleAnalyze}
          className="gap-2 bg-pinterest-red text-white"
          disabled={isLoading || !pinUrl}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Extract Keywords
            </>
          )}
        </Button>
      </div>

      {!user && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Guest mode: {2 - pinCount} free extractions remaining
        </div>
      )}

      {keywords.length > 0 && (
        <Card className="glass-card animate-fade-in-up shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Pinterest Keywords</CardTitle>
            <CardDescription>
              Keywords extracted from your Pinterest pin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Monthly Volume</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Trending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((keyword, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          keyword.difficulty === 'Low' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                            : keyword.difficulty === 'Medium'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        }`}>
                          {keyword.difficulty}
                        </span>
                      </TableCell>
                      <TableCell>
                        {keyword.trending ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Free limit reached</DialogTitle>
            <DialogDescription>
              You've used your 2 free pin analyses. Sign up to analyze unlimited pins!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <p>
              Create an account to enjoy unlimited pin keyword analysis and additional features:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Analyze unlimited Pinterest pins</li>
              <li>Save your keyword research history</li>
              <li>Export data in multiple formats</li>
              <li>Track keyword performance over time</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button 
              variant="outline"
              onClick={() => setShowSignupDialog(false)}
            >
              Maybe Later
            </Button>
            <Button 
              className="bg-pinterest-red text-white"
              onClick={() => {
                setShowSignupDialog(false);
                navigate('/auth');
              }}
            >
              Sign Up Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KeywordDownloader;
