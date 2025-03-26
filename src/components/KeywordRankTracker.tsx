
import { useState } from 'react';
import { Plus, Trash2, LineChart, ArrowUp, ArrowDown, Search, Download } from 'lucide-react';
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
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Ranking {
  date: string;
  position: number;
}

interface KeywordRanking {
  id: string;
  keyword: string;
  currentPosition: number;
  previousPosition: number | null;
  bestPosition: number;
  dateAdded: string;
  history: Ranking[];
}

// Mock data for keyword rankings
const initialKeywords: KeywordRanking[] = [
  {
    id: '1',
    keyword: 'modern farmhouse decor',
    currentPosition: 5,
    previousPosition: 8,
    bestPosition: 3,
    dateAdded: '2023-09-10',
    history: [
      { date: '2023-09-10', position: 12 },
      { date: '2023-09-17', position: 10 },
      { date: '2023-09-24', position: 8 },
      { date: '2023-10-01', position: 5 },
    ]
  },
  {
    id: '2',
    keyword: 'pinterest marketing tips',
    currentPosition: 2,
    previousPosition: 4,
    bestPosition: 2,
    dateAdded: '2023-09-05',
    history: [
      { date: '2023-09-05', position: 7 },
      { date: '2023-09-12', position: 5 },
      { date: '2023-09-19', position: 4 },
      { date: '2023-09-26', position: 2 },
    ]
  },
  {
    id: '3',
    keyword: 'home office ideas',
    currentPosition: 9,
    previousPosition: 6,
    bestPosition: 4,
    dateAdded: '2023-09-15',
    history: [
      { date: '2023-09-15', position: 15 },
      { date: '2023-09-22', position: 12 },
      { date: '2023-09-29', position: 6 },
      { date: '2023-10-06', position: 9 },
    ]
  }
];

export const KeywordRankTracker = () => {
  const [newKeyword, setNewKeyword] = useState('');
  const [trackedKeywords, setTrackedKeywords] = useState<KeywordRanking[]>(initialKeywords);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordRanking | null>(null);
  const { toast } = useToast();

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const keyword = newKeyword.trim();
    
    if (trackedKeywords.some(k => k.keyword.toLowerCase() === keyword.toLowerCase())) {
      toast({
        title: 'Keyword Already Tracked',
        description: `You're already tracking "${keyword}"`,
        variant: 'destructive'
      });
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const initialPosition = Math.floor(Math.random() * 50) + 1; // Mock initial position
    
    const newKeywordRanking: KeywordRanking = {
      id: Date.now().toString(),
      keyword: keyword,
      currentPosition: initialPosition,
      previousPosition: null,
      bestPosition: initialPosition,
      dateAdded: today,
      history: [{ date: today, position: initialPosition }]
    };
    
    setTrackedKeywords(prev => [...prev, newKeywordRanking]);
    setNewKeyword('');
    
    toast({
      title: 'Keyword Added',
      description: `Now tracking "${keyword}" with initial position #${initialPosition}`,
    });
  };

  const handleRemoveKeyword = (id: string) => {
    const keyword = trackedKeywords.find(k => k.id === id);
    if (!keyword) return;
    
    setTrackedKeywords(prev => prev.filter(k => k.id !== id));
    
    if (selectedKeyword?.id === id) {
      setSelectedKeyword(null);
    }
    
    toast({
      title: 'Keyword Removed',
      description: `Stopped tracking "${keyword.keyword}"`,
    });
  };

  const handleViewChart = (keyword: KeywordRanking) => {
    setSelectedKeyword(keyword);
  };

  const getPositionChange = (current: number, previous: number | null) => {
    if (previous === null) return null;
    const change = previous - current;
    return { value: Math.abs(change), improved: change > 0 };
  };

  const formatChartData = (history: Ranking[]) => {
    return history.map(item => ({
      date: item.date.split('-').slice(1).join('/'), // Format as MM/DD
      position: item.position
    }));
  };

  const handleDownloadReport = () => {
    const csvContent = [
      ['Keyword', 'Current Position', 'Previous Position', 'Change', 'Best Position', 'Date Added'],
      ...trackedKeywords.map(k => {
        const change = k.previousPosition !== null ? (k.previousPosition - k.currentPosition) : 'N/A';
        return [
          k.keyword,
          k.currentPosition,
          k.previousPosition || 'N/A',
          typeof change === 'number' ? (change > 0 ? `+${change}` : change) : change,
          k.bestPosition,
          k.dateAdded
        ];
      })
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `pinterest-rankings-${Date.now()}.csv`);
    a.click();
    
    toast({
      title: 'Report Downloaded',
      description: `Report with ${trackedKeywords.length} tracked keywords has been downloaded.`,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 w-full">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                type="text" 
                placeholder="Enter a keyword to track..." 
                value={newKeyword} 
                onChange={e => setNewKeyword(e.target.value)} 
                className="pr-10 w-full" 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button 
              onClick={handleAddKeyword} 
              disabled={!newKeyword.trim()} 
              className="gap-2 text-white bg-pinterest-red"
            >
              <Plus className="h-4 w-4" />
              Track
            </Button>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadReport}
          disabled={trackedKeywords.length === 0}
          className="gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`rounded-md border bg-black text-white lg:col-span-2 ${selectedKeyword ? 'lg:col-span-2' : 'lg:col-span-5'}`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Best</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackedKeywords.length > 0 ? (
                trackedKeywords.map(keyword => {
                  const change = getPositionChange(keyword.currentPosition, keyword.previousPosition);
                  
                  return (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>#{keyword.currentPosition}</TableCell>
                      <TableCell>
                        {change !== null ? (
                          <div className="flex items-center gap-1">
                            {change.improved ? (
                              <>
                                <ArrowUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">+{change.value}</span>
                              </>
                            ) : change.value === 0 ? (
                              <span className="text-gray-400">0</span>
                            ) : (
                              <>
                                <ArrowDown className="h-4 w-4 text-red-500" />
                                <span className="text-red-500">-{change.value}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">New</span>
                        )}
                      </TableCell>
                      <TableCell>#{keyword.bestPosition}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewChart(keyword)}
                            className="h-8 w-8"
                          >
                            <LineChart className="h-4 w-4" />
                            <span className="sr-only">View chart</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveKeyword(keyword.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                    No keywords are being tracked. Enter a keyword above to start tracking.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {selectedKeyword && (
          <div className="lg:col-span-3 bg-black text-white rounded-md border p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{selectedKeyword.keyword}</h3>
              <p className="text-sm text-gray-400">
                Tracking since {new Date(selectedKeyword.dateAdded).toLocaleDateString()}
              </p>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart
                  data={formatChartData(selectedKeyword.history)}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" domain={['dataMax + 5', 'dataMin - 5']} reversed />
                  <Tooltip 
                    formatter={(value: number) => [`#${value}`, 'Position']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ background: '#333', borderColor: '#555' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="position" 
                    name="Ranking" 
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              <p>Lower positions represent better rankings on Pinterest search results.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordRankTracker;
