
import { useState } from 'react';
import { Search, Download, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface Keyword {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number | null;
  isInterest: boolean;
  relatedKeywords: string[];
}

const mockInterests = [
  'home decor ideas',
  'modern farmhouse',
  'boho chic',
  'minimalist home',
  'scandinavian design',
  'industrial interior',
  'living room decor',
  'small space solutions',
  'kitchen design',
  'bedroom makeover',
  'bathroom renovation',
  'diy home projects',
].map((keyword, index) => ({
  id: `int-${index}`,
  keyword,
  volume: Math.floor(Math.random() * 10000) + 500,
  difficulty: Math.floor(Math.random() * 80) + 20,
  isInterest: true,
  relatedKeywords: Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, i) => 
    `${keyword} ${['ideas', 'inspiration', 'tips', 'designs', 'trends'][i % 5]}`)
}));

const mockKeywords = [
  'pinterest seo',
  'pin design tips', 
  'how to use pinterest for business',
  'pinterest marketing strategy',
  'grow pinterest followers',
  'pinterest keyword research',
  'pinterest board ideas',
  'increase pinterest traffic',
  'pinterest analytics guide',
  'pinterest business account',
  'pinterest trends 2023',
  'pinterest algorithm',
].map((keyword, index) => ({
  id: `kw-${index}`,
  keyword,
  volume: Math.floor(Math.random() * 8000) + 200,
  difficulty: Math.floor(Math.random() * 100),
  isInterest: false,
  relatedKeywords: Array.from({length: Math.floor(Math.random() * 5) + 1}, (_, i) => 
    `${keyword} ${['guide', 'tutorial', 'examples', 'case study', 'best practices'][i % 5]}`)
}));

export const KeywordExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [savedKeywords, setSavedKeywords] = useState<string[]>([]);
  const [allKeywords, setAllKeywords] = useState<Keyword[]>([...mockKeywords, ...mockInterests]);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate random new keywords based on search term
      const newKeywords: Keyword[] = Array.from({length: 8}, (_, i) => ({
        id: `new-${Date.now()}-${i}`,
        keyword: `${searchTerm} ${['ideas', 'tips', 'guide', 'inspiration', 'trends', 'examples', 'tutorial', 'design'][i % 8]}`,
        volume: Math.floor(Math.random() * 5000) + 100,
        difficulty: Math.floor(Math.random() * 100),
        isInterest: Math.random() > 0.5,
        relatedKeywords: Array.from({length: Math.floor(Math.random() * 4) + 1}, (_, j) => 
          `${searchTerm} ${['beginner', 'advanced', 'professional', 'easy', 'simple'][j % 5]}`)
      }));
      
      setAllKeywords(prev => [...newKeywords, ...prev]);
      setIsLoading(false);
      
      toast({
        title: 'Keywords Found',
        description: `Found ${newKeywords.length} keywords related to "${searchTerm}"`,
      });
    }, 1500);
  };

  const toggleSaveKeyword = (keywordId: string) => {
    const keyword = allKeywords.find(k => k.id === keywordId);
    if (!keyword) return;
    
    if (savedKeywords.includes(keywordId)) {
      setSavedKeywords(prev => prev.filter(id => id !== keywordId));
      toast({
        title: 'Keyword Removed',
        description: `"${keyword.keyword}" has been removed from saved keywords.`,
      });
    } else {
      setSavedKeywords(prev => [...prev, keywordId]);
      toast({
        title: 'Keyword Saved',
        description: `"${keyword.keyword}" has been added to saved keywords.`,
      });
    }
  };

  const handleDownloadKeywords = () => {
    let keywordsToDownload: Keyword[];
    
    switch (activeTab) {
      case 'interests':
        keywordsToDownload = allKeywords.filter(k => k.isInterest);
        break;
      case 'saved':
        keywordsToDownload = allKeywords.filter(k => savedKeywords.includes(k.id));
        break;
      default:
        keywordsToDownload = allKeywords;
    }
    
    if (keywordsToDownload.length === 0) {
      toast({
        title: 'No Keywords',
        description: 'There are no keywords to download.',
        variant: 'destructive',
      });
      return;
    }
    
    const csvContent = [
      ['Keyword', 'Monthly Volume', 'Difficulty', 'Type', 'Related Keywords'],
      ...keywordsToDownload.map(k => [
        k.keyword,
        k.volume,
        k.difficulty || 'N/A',
        k.isInterest ? 'Interest' : 'Keyword',
        k.relatedKeywords.join(', ')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `pinterest-keywords-${Date.now()}.csv`);
    a.click();
    
    toast({
      title: 'Keywords Downloaded',
      description: `Successfully downloaded ${keywordsToDownload.length} keywords.`,
    });
  };

  const filteredKeywords = allKeywords.filter(k => {
    if (searchTerm && !k.keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    switch (activeTab) {
      case 'interests':
        return k.isInterest;
      case 'saved':
        return savedKeywords.includes(k.id);
      default:
        return true;
    }
  });

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSearch} className="w-full mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input 
              type="text" 
              placeholder="Search keywords or interests..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pr-10" 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !searchTerm.trim()} 
            className="gap-2 text-white bg-pinterest-red"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : 'Find Keywords'}
          </Button>
        </div>
      </form>

      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All Keywords</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          onClick={handleDownloadKeywords}
          className="gap-2"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="rounded-md border bg-black text-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Monthly Volume</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Related Keywords</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeywords.length > 0 ? (
              filteredKeywords.map(keyword => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    {keyword.difficulty !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              keyword.difficulty < 30 ? 'bg-green-500' : 
                              keyword.difficulty < 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{width: `${keyword.difficulty}%`}}
                          />
                        </div>
                        <span className="text-xs">{keyword.difficulty}%</span>
                      </div>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      keyword.isInterest 
                        ? 'bg-blue-900 text-blue-200' 
                        : 'bg-purple-900 text-purple-200'
                    }`}>
                      {keyword.isInterest ? 'Interest' : 'Keyword'}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-wrap gap-1">
                      {keyword.relatedKeywords.map((related, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-200">
                          {related}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleSaveKeyword(keyword.id)}
                      className={savedKeywords.includes(keyword.id) ? 'text-yellow-400' : ''}
                    >
                      <Star className="h-4 w-4" />
                      <span className="sr-only">
                        {savedKeywords.includes(keyword.id) ? 'Remove from saved' : 'Save keyword'}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                  {searchTerm 
                    ? 'No keywords found matching your search. Try a different term.' 
                    : activeTab === 'saved' 
                      ? 'No saved keywords yet. Click the star icon to save keywords.' 
                      : 'Search for keywords or browse the tabs to explore Pinterest keywords.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KeywordExplorer;
