
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AnalyticsEngine from "@/components/AnalyticsEngine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const [previousAnalyses, setPreviousAnalyses] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousAnalyses = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("pinterest_analytics")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
          
        if (error) throw error;
        setPreviousAnalyses(data || []);
      } catch (error) {
        console.error("Error fetching previous analyses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreviousAnalyses();
  }, [user]);

  const handleAnalysisComplete = (result: any) => {
    // Refresh the list of previous analyses
    if (user) {
      supabase
        .from("pinterest_analytics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setPreviousAnalyses(data);
        });
    }
  };

  const formatAnalysisType = (type: string) => {
    switch (type) {
      case "pin":
        return "Pin Analysis";
      case "profile":
        return "Profile Analysis";
      case "keyword":
        return "Keyword Analysis";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pin":
        return "bg-blue-900 text-blue-200";
      case "profile":
        return "bg-purple-900 text-purple-200";
      case "keyword":
        return "bg-pink-900 text-pink-200";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  const renderSelectedAnalysis = () => {
    if (!selectedAnalysis) return null;
    
    return (
      <Card className="bg-black border-gray-700 mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{formatAnalysisType(selectedAnalysis.type)}: {selectedAnalysis.query}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(selectedAnalysis.created_at), "PPpp")}
              </CardDescription>
            </div>
            <Badge className={getTypeColor(selectedAnalysis.type)}>
              {formatAnalysisType(selectedAnalysis.type)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {selectedAnalysis.type === "pin" && selectedAnalysis.results && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  {selectedAnalysis.results.image_url && (
                    <img 
                      src={selectedAnalysis.results.image_url} 
                      alt={selectedAnalysis.results.title} 
                      className="w-full h-auto rounded-lg border border-gray-700"
                    />
                  )}
                </div>
                <div className="sm:w-2/3">
                  <h3 className="text-xl font-bold mb-2">{selectedAnalysis.results.title}</h3>
                  <p className="text-gray-400 mb-4">{selectedAnalysis.results.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Engagement Score</h4>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-pinterest-red h-2.5 rounded-full" 
                        style={{ width: `${selectedAnalysis.results.engagement_score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-right mt-1">{selectedAnalysis.results.engagement_score}/100</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalysis.results.keywords?.slice(0, 10).map((keyword: any, i: number) => (
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
              </div>
            </div>
          )}
          
          {selectedAnalysis.type === "profile" && selectedAnalysis.results && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-1/3">
                  <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center">
                    {selectedAnalysis.results.profile_image && (
                      <img 
                        src={selectedAnalysis.results.profile_image} 
                        alt={selectedAnalysis.results.username} 
                        className="w-24 h-24 rounded-full mb-2"
                      />
                    )}
                    <h3 className="text-xl font-bold">{selectedAnalysis.results.username}</h3>
                    <p className="text-gray-400 mt-2">{selectedAnalysis.results.pin_count} pins</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Top Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalysis.results.top_keywords?.slice(0, 15).map((keyword: any, i: number) => (
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
                    {selectedAnalysis.results.top_pins?.map((pin: any, i: number) => (
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
                </div>
              </div>
            </div>
          )}
          
          {selectedAnalysis.type === "keyword" && selectedAnalysis.results && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-2/3">
                  <h3 className="text-xl font-bold mb-2">"{selectedAnalysis.results.keyword}"</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-400">Pin Count</h4>
                      <p className="text-2xl font-bold">{selectedAnalysis.results.pin_count}</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-400">Trend Score</h4>
                      <p className="text-2xl font-bold">{selectedAnalysis.results.trend_score}/100</p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-400">Avg. Engagement</h4>
                      <p className="text-2xl font-bold">{selectedAnalysis.results.average_engagement}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Related Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnalysis.results.related_keywords?.map((keyword: any, i: number) => (
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
                
                <div className="sm:w-1/3">
                  <h4 className="font-semibold mb-3">Sample Pins</h4>
                  <div className="space-y-3">
                    {selectedAnalysis.results.sample_pins?.map((pin: any, i: number) => (
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
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Powerful Pinterest analytics with AI-powered insights and trend analysis
        </p>
      </div>
      
      <Tabs defaultValue="new" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Analysis</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <AnalyticsEngine onAnalysisComplete={handleAnalysisComplete} />
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="bg-black border-gray-700">
            <CardHeader>
              <CardTitle>Previous Analyses</CardTitle>
              <CardDescription>
                View and reuse your previous Pinterest analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6 text-gray-400">
                  Loading your previous analyses...
                </div>
              ) : previousAnalyses.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  You haven't performed any analyses yet. Try the "New Analysis" tab to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {previousAnalyses.map((analysis) => (
                    <div 
                      key={analysis.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${
                        selectedAnalysis?.id === analysis.id 
                          ? 'bg-gray-800 border-l-4 border-pinterest-red' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div>
                        <div className="font-medium">{analysis.query}</div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(analysis.created_at), "PPpp")}
                        </div>
                      </div>
                      <Badge className={getTypeColor(analysis.type)}>
                        {formatAnalysisType(analysis.type)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {renderSelectedAnalysis()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdvancedAnalytics;
