
import { useState } from 'react';
import { Lightbulb, TrendingUp, History } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KeywordResearchTool from '@/components/KeywordResearchTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/utils/languageUtils';

const KeywordResearch = () => {
  const { t } = useLanguage();
  
  const mockKeywordIdeas = [
    {
      category: "Home & Garden",
      keywords: [
        "living room design ideas",
        "small kitchen organization",
        "minimalist bathroom",
        "cozy bedroom decor",
        "indoor plants low light",
        "home office setup"
      ]
    },
    {
      category: "Food & Recipes",
      keywords: [
        "easy dinner recipes",
        "healthy breakfast ideas",
        "vegan lunch recipes",
        "quick desserts",
        "meal prep for week",
        "summer salads"
      ]
    },
    {
      category: "Fashion & Style",
      keywords: [
        "casual outfit ideas",
        "summer fashion trends",
        "minimalist wardrobe",
        "business casual women",
        "comfortable work shoes",
        "capsule wardrobe essentials"
      ]
    }
  ];
  
  const mockTrendingTopics = [
    "sustainable living",
    "air fryer recipes",
    "minimalist interior",
    "remote work setup",
    "capsule wardrobe",
    "bullet journal ideas",
    "plant based meals",
    "productivity hacks"
  ];
  
  const mockSearchHistory = [
    "home decor",
    "vegan recipes",
    "workout routines",
    "travel destinations",
    "DIY projects"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('keywordResearchFeature')}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Discover popular keywords and topics for your Pinterest content
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Keyword Research Tool */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Keyword Explorer</CardTitle>
                  <CardDescription>
                    Search for keywords to find related topics and ideas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KeywordResearchTool />
                </CardContent>
              </Card>
              
              {/* Keyword Categories */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Browse by Category</CardTitle>
                  <CardDescription>
                    Explore popular keywords across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={mockKeywordIdeas[0].category}>
                    <TabsList className="mb-4">
                      {mockKeywordIdeas.map((category) => (
                        <TabsTrigger key={category.category} value={category.category}>
                          {category.category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {mockKeywordIdeas.map((category) => (
                      <TabsContent key={category.category} value={category.category} className="mt-0">
                        <div className="flex flex-wrap gap-2">
                          {category.keywords.map((keyword, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="py-1.5 px-3 cursor-pointer hover:bg-accent transition-colors"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-pinterest-red" />
                    <CardTitle className="text-lg">Trending Topics</CardTitle>
                  </div>
                  <CardDescription>
                    Popular topics on Pinterest right now
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockTrendingTopics.map((topic, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="py-1.5 px-3 cursor-pointer hover:bg-accent transition-colors"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Keyword Ideas */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-pinterest-red" />
                    <CardTitle className="text-lg">Keyword Ideas</CardTitle>
                  </div>
                  <CardDescription>
                    Inspiration for your content strategy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-accent rounded-lg">
                    <p className="font-medium mb-1">Try more specific keywords</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Instead of "home decor", try "minimalist living room decor" for better targeting
                    </p>
                  </div>
                  <div className="p-3 bg-accent rounded-lg">
                    <p className="font-medium mb-1">Include seasonal terms</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add "summer", "fall", "winter", or "spring" to your keywords when relevant
                    </p>
                  </div>
                  <div className="p-3 bg-accent rounded-lg">
                    <p className="font-medium mb-1">Use action words</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Words like "how to", "DIY", "easy", "quick" can increase engagement
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Searches */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-pinterest-red" />
                    <CardTitle className="text-lg">Recent Searches</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockSearchHistory.map((search, index) => (
                      <li key={index} className="text-sm py-1.5 px-3 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                        {search}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KeywordResearch;
