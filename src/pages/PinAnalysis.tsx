
import { Sparkles, FileText, Lightbulb } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PinAnalyzer from '@/components/PinAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/utils/languageUtils';

const PinAnalysis = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('pinAnalysisFeature')}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Analyze any Pinterest pin to extract keywords and view performance metrics
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pin Analyzer */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Pin Analyzer</CardTitle>
                  <CardDescription>
                    Enter a Pinterest pin URL to extract keywords and analyze performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PinAnalyzer />
                </CardContent>
              </Card>
              
              {/* How it Works */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>How Pin Analysis Works</CardTitle>
                  <CardDescription>
                    Understanding what makes Pinterest pins perform well
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-accent">
                      <div className="w-10 h-10 rounded-full bg-pinterest-red flex items-center justify-center text-white mb-4">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium mb-2">Content Analysis</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We analyze the pin's description, title, and associated content to identify keywords and topics.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-accent">
                      <div className="w-10 h-10 rounded-full bg-pinterest-red flex items-center justify-center text-white mb-4">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium mb-2">Engagement Metrics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We evaluate saves, clicks, and impressions to calculate a pin score that measures performance.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-accent">
                      <div className="w-10 h-10 rounded-full bg-pinterest-red flex items-center justify-center text-white mb-4">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium mb-2">Keyword Generation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        If no keywords are found, our AI generates relevant, SEO-optimized keywords for your pin.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Tips Sidebar */}
            <div className="space-y-6">
              {/* Quick Tips */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pin Optimization Tips</CardTitle>
                  <CardDescription>
                    How to improve your pin's performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="font-medium mb-1 text-pinterest-red">Use the right keywords</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Include relevant keywords in your pin title, description, and even the image itself
                    </p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="font-medium mb-1 text-pinterest-red">Optimize image dimensions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use a 2:3 aspect ratio (e.g., 1000x1500 pixels) for better visibility in the Pinterest feed
                    </p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="font-medium mb-1 text-pinterest-red">Create descriptive alt text</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add detailed alt text to make your pins more accessible and improve SEO
                    </p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="font-medium mb-1 text-pinterest-red">Link to relevant content</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ensure your pin links to content that delivers what the pin promises
                    </p>
                  </div>
                  
                  <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="font-medium mb-1 text-pinterest-red">Be consistent</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pin regularly and maintain a consistent style to build audience recognition
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Examples */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Example Analysis</CardTitle>
                  <CardDescription>
                    See how top-performing pins are structured
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                      <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <span className="text-sm">Pin Image Preview</span>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-1">10 Easy Meal Prep Ideas for Busy Weekdays</h4>
                        <p className="text-xs text-gray-500 mb-2">Keywords: meal prep, easy recipes, time saving meals, healthy lunch</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Pin Score: 92</span>
                          <span>Saves: 12.5k</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                      <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <span className="text-sm">Pin Image Preview</span>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-1">15 Minute Morning Yoga Routine for Beginners</h4>
                        <p className="text-xs text-gray-500 mb-2">Keywords: yoga routine, beginners, morning workout, quick exercise</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Pin Score: 88</span>
                          <span>Saves: 8.3k</span>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default PinAnalysis;
