
import { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  ChevronUp, 
  ImagePlus, 
  Hash, 
  TrendingUp
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import PinAnalyzer from '@/components/PinAnalyzer';
import { useLanguage } from '@/utils/languageUtils';
import GlowingChart from '@/components/ui/glowing-chart';

// Mock data for charts
const mockAreaData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 3000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const mockKeywordData = [
  { name: 'home decor', value: 4000 },
  { name: 'recipes', value: 3000 },
  { name: 'fashion', value: 2000 },
  { name: 'travel', value: 2780 },
  { name: 'DIY', value: 1890 },
];

const Dashboard = () => {
  const [showPinAnalyzer, setShowPinAnalyzer] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCreatePin = () => {
    navigate('/create-pin');
  };

  const handleTrackRankings = () => {
    navigate('/keyword-research');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back! Here's an overview of your Pinterest performance.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Saves</p>
                <p className="text-2xl font-bold">12,546</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <ChevronUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>8.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Impressions</p>
                <p className="text-2xl font-bold">248,256</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
                <p className="text-2xl font-bold">3.2%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>1.8% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Top Keywords</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Hash className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>5 new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <GlowingChart title="Impressions Over Time" description="Your pin visibility growth over the past months">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockAreaData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea384c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ea384c" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.3} />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    borderColor: '#ea384c', 
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(234,56,76,0.5)',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ea384c"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowingChart>
        
        <GlowingChart title="Top Performing Keywords" description="Keywords driving the most traffic to your pins">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockKeywordData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ea384c" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.3} />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" width={80} stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    borderColor: '#ea384c', 
                    borderRadius: '8px',
                    boxShadow: '0 0 10px rgba(234,56,76,0.5)',
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
                  radius={[0, 4, 4, 0]}
                  className="filter drop-shadow-[0_0_3px_rgba(234,56,76,0.3)]"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlowingChart>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="justify-start h-auto py-6 gap-4 glass-card hover:bg-accent"
            onClick={() => setShowPinAnalyzer(!showPinAnalyzer)}
          >
            <div className="w-10 h-10 rounded-lg bg-pinterest-red flex items-center justify-center text-white">
              <Search className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">Analyze Pin</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Extract keywords from any pin
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            className="justify-start h-auto py-6 gap-4 glass-card hover:bg-accent"
            onClick={handleCreatePin}
          >
            <div className="w-10 h-10 rounded-lg bg-pinterest-red flex items-center justify-center text-white">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">Create Pin</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Design and post a new pin
              </p>
            </div>
          </Button>
          
          <Button 
            variant="outline"
            className="justify-start h-auto py-6 gap-4 glass-card hover:bg-accent"
            onClick={handleTrackRankings}
          >
            <div className="w-10 h-10 rounded-lg bg-pinterest-red flex items-center justify-center text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">Track Rankings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor your keyword positions
              </p>
            </div>
          </Button>
        </div>
      </div>
      
      {/* Pin Analyzer Section */}
      {showPinAnalyzer && (
        <Card className="glass-card mb-10 animate-fade-in-up">
          <CardHeader>
            <CardTitle>Pin Analyzer</CardTitle>
            <CardDescription>
              Enter a Pinterest pin URL to analyze keywords and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PinAnalyzer />
          </CardContent>
        </Card>
      )}
      
      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest pins and keyword tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent hover:bg-opacity-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ImagePlus className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New pin created</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "Minimalist home office setup ideas"
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent hover:bg-opacity-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Keyword ranking improved</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "home organization ideas" moved from #18 to #5
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</p>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent hover:bg-opacity-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Pin analysis completed</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  "Summer cocktail recipes" - 12 keywords extracted
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
