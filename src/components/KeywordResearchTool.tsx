
import { useState } from 'react';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/utils/languageUtils';
import { MOCK_POPULAR_KEYWORDS } from '@/lib/constants';

export const KeywordResearchTool = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    popular: string[];
    related: string[];
    trending: string[];
  }>({
    popular: [],
    related: [],
    trending: []
  });
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock results based on search query
      const mockPopular = MOCK_POPULAR_KEYWORDS.filter(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const mockRelated = [
        `${searchQuery} ideas`,
        `best ${searchQuery}`,
        `${searchQuery} inspiration`,
        `creative ${searchQuery}`,
        `${searchQuery} for beginners`,
        `${searchQuery} tips`,
        `easy ${searchQuery}`,
        `${searchQuery} tutorial`,
        `${searchQuery} design`,
        `${searchQuery} projects`
      ];
      
      const mockTrending = [
        `modern ${searchQuery}`,
        `${searchQuery} 2023`,
        `minimalist ${searchQuery}`,
        `${searchQuery} hacks`,
        `${searchQuery} aesthetic`,
        `diy ${searchQuery}`,
        `${searchQuery} instagram`,
        `${searchQuery} tiktok`
      ];
      
      setSearchResults({
        popular: mockPopular.length > 0 ? mockPopular : mockRelated.slice(0, 5),
        related: mockRelated,
        trending: mockTrending
      });
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={t('searchKeywords')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !searchQuery}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('loading')}
              </>
            ) : (
              t('search')
            )}
          </Button>
        </div>
      </form>

      {/* Results Tabs */}
      {(searchResults.popular.length > 0 || searchResults.related.length > 0) && (
        <Card className="glass-card animate-fade-in-up">
          <CardHeader className="pb-2">
            <CardTitle>Keyword Research Results</CardTitle>
            <CardDescription>
              Explore popular and related keywords for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="popular">{t('popularKeywords')}</TabsTrigger>
                <TabsTrigger value="related">{t('relatedKeywords')}</TabsTrigger>
                <TabsTrigger value="trending">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{t('trending')}</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {searchResults.popular.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="py-1.5 px-3">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="related" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {searchResults.related.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="py-1.5 px-3">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="trending" className="mt-0">
                <div className="flex flex-wrap gap-2">
                  {searchResults.trending.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="py-1.5 px-3">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Show popular keywords initially */}
      {!searchQuery && !isLoading && searchResults.popular.length === 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle>{t('popularKeywords')}</CardTitle>
            <CardDescription>
              Trending keywords on Pinterest right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {MOCK_POPULAR_KEYWORDS.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="py-1.5 px-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => {
                    setSearchQuery(keyword);
                    // Optional: auto-search
                    // handleSearch({ preventDefault: () => {} } as React.FormEvent);
                  }}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Empty search results */}
      {searchQuery && !isLoading && 
        searchResults.popular.length === 0 && 
        searchResults.related.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            {t('noResults')}
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordResearchTool;
