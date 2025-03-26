
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/utils/languageUtils";
import { BarChart4, TrendingUp, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import KeywordRankTracker from "@/components/KeywordRankTracker";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Mock data for charts
const impressionsData = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1900 },
  { date: "Mar", value: 3000 },
  { date: "Apr", value: 2780 },
  { date: "May", value: 1890 },
  { date: "Jun", value: 2390 },
  { date: "Jul", value: 3490 },
];

const engagementData = [
  { date: "Jan", saves: 420, clicks: 380, comments: 120 },
  { date: "Feb", saves: 680, clicks: 520, comments: 150 },
  { date: "Mar", saves: 980, clicks: 780, comments: 220 },
  { date: "Apr", saves: 870, clicks: 680, comments: 190 },
  { date: "May", saves: 640, clicks: 490, comments: 120 },
  { date: "Jun", saves: 780, clicks: 590, comments: 160 },
  { date: "Jul", saves: 1020, clicks: 820, comments: 230 },
];

// Mock account stats
const accountStats = {
  totalPins: 157,
  monthlyViews: 24892,
  followers: 1843,
  avgEngagement: 6.5,
  monthlyChange: {
    views: 12.5,
    followers: 8.2,
    engagement: 2.1
  }
};

const PinStats = () => {
  const { t } = useLanguage();
  const [accountUrl, setAccountUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnalyzeAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountUrl) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would update with actual data from the analyzed account
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pin Statistics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track and analyze the performance of your Pinterest pins and account
        </p>
      </div>
      
      {/* Account Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black text-white rounded-xl border border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Impressions</h3>
            <TrendingUp className="h-6 w-6 text-pinterest-red" />
          </div>
          <p className="text-3xl font-bold">{accountStats.monthlyViews.toLocaleString()}</p>
          <p className="flex items-center text-sm text-green-400">
            <ChevronUp className="h-4 w-4 mr-1" />
            +{accountStats.monthlyChange.views}% from last month
          </p>
        </div>
        
        <div className="bg-black text-white rounded-xl border border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Saves</h3>
            <BarChart4 className="h-6 w-6 text-pinterest-red" />
          </div>
          <p className="text-3xl font-bold">{accountStats.followers.toLocaleString()}</p>
          <p className="flex items-center text-sm text-green-400">
            <ChevronUp className="h-4 w-4 mr-1" />
            +{accountStats.monthlyChange.followers}% from last month
          </p>
        </div>
        
        <div className="bg-black text-white rounded-xl border border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Average Engagement</h3>
            <BarChart4 className="h-6 w-6 text-pinterest-red" />
          </div>
          <p className="text-3xl font-bold">{accountStats.avgEngagement}%</p>
          <p className="flex items-center text-sm text-green-400">
            <ChevronUp className="h-4 w-4 mr-1" />
            +{accountStats.monthlyChange.engagement}% from last month
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="account" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account Performance</TabsTrigger>
          <TabsTrigger value="pins">Pin Analytics</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Rankings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="bg-black text-white border-gray-700 mb-6">
            <CardHeader>
              <CardTitle>Account Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Enter a Pinterest account URL to analyze its stats and top pins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyzeAccount} className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Input 
                    type="url" 
                    placeholder="Enter Pinterest account URL..." 
                    value={accountUrl} 
                    onChange={e => setAccountUrl(e.target.value)} 
                    className="bg-gray-900 border-gray-700" 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !accountUrl} 
                  className="gap-2 text-white bg-pinterest-red"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </form>
              
              <div className="text-center text-gray-400">
                <p>Enter an account URL to see detailed analytics for that Pinterest account.</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black text-white border-gray-700">
              <CardHeader>
                <CardTitle>Impressions Over Time</CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly pin impressions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={impressionsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ background: '#333', borderColor: '#555', color: '#fff' }} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        name="Impressions" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black text-white border-gray-700">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Saves, clicks, and comments on your pins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={engagementData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip contentStyle={{ background: '#333', borderColor: '#555', color: '#fff' }} />
                      <Legend />
                      <Bar dataKey="saves" name="Saves" fill="#ea384c" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clicks" name="Clicks" fill="#9f1239" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="comments" name="Comments" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pins">
          <Card className="bg-black text-white border-gray-700">
            <CardHeader>
              <CardTitle>Pin Performance</CardTitle>
              <CardDescription className="text-gray-400">
                Analyze the performance of your individual pins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p className="text-gray-400">Select an account or enter a pin URL to view detailed pin analytics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="keywords">
          <Card className="bg-black text-white border-gray-700">
            <CardHeader>
              <CardTitle>Keyword Rank Tracker</CardTitle>
              <CardDescription className="text-gray-400">
                Track your Pinterest keyword rankings over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordRankTracker />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PinStats;
