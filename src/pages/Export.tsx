
import { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/utils/languageUtils";
import { MOCK_PIN_STATS } from '@/lib/constants';
import { Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for recent pin analyses
const MOCK_HISTORY = [
  {
    id: '1',
    url: 'https://pinterest.com/pin/123456789',
    title: 'Minimalist Scandinavian Living Room',
    description: 'Clean lines and neutral colors create a calm minimalist space.',
    keywords: ['minimalist', 'scandinavian', 'living room', 'neutral colors', 'interior design'],
    stats: MOCK_PIN_STATS,
    status: 'completed',
    date: '2023-08-15T14:32:00Z'
  },
  {
    id: '2',
    url: 'https://pinterest.com/pin/987654321',
    title: 'Modern Kitchen Design Ideas',
    description: 'Contemporary kitchen with marble countertops and wood accents.',
    keywords: ['modern kitchen', 'marble', 'wood accents', 'contemporary', 'kitchen design'],
    stats: {...MOCK_PIN_STATS, saves: 342, clicks: 156, impressions: 2150},
    status: 'completed',
    date: '2023-08-14T09:15:00Z'
  },
  {
    id: '3',
    url: 'https://pinterest.com/pin/456789123',
    title: 'Small Space Office Solutions',
    description: 'Creative ways to set up a productive home office in small spaces.',
    keywords: ['home office', 'small space', 'productivity', 'desk setup', 'organization'],
    stats: {...MOCK_PIN_STATS, saves: 289, clicks: 112, impressions: 1984},
    status: 'pending',
    date: '2023-08-13T16:45:00Z'
  }
];

const ExportPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [exportHistory, setExportHistory] = useState(MOCK_HISTORY);
  
  const filteredHistory = exportHistory.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownload = (pinData: typeof MOCK_HISTORY[0]) => {
    // Create CSV content
    const csvContent = [
      ['URL', 'Title', 'Description', 'Keywords', 'Pin Score', 'Saves', 'Clicks', 'Impressions', 'Engagement', 'Status', 'Date'],
      [
        pinData.url,
        pinData.title,
        pinData.description,
        pinData.keywords.join(', '),
        pinData.stats.pinScore,
        pinData.stats.saves,
        pinData.stats.clicks,
        pinData.stats.impressions,
        `${pinData.stats.engagement}%`,
        pinData.status,
        new Date(pinData.date).toLocaleString()
      ]
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `pin-export-${pinData.id}.csv`);
    a.click();
  };

  const handleDownloadAll = () => {
    // Create CSV content for all filtered items
    const csvContent = [
      ['URL', 'Title', 'Description', 'Keywords', 'Pin Score', 'Saves', 'Clicks', 'Impressions', 'Engagement', 'Status', 'Date'],
      ...filteredHistory.map(item => [
        item.url,
        item.title,
        item.description,
        item.keywords.join(', '),
        item.stats.pinScore,
        item.stats.saves,
        item.stats.clicks,
        item.stats.impressions,
        `${item.stats.engagement}%`,
        item.status,
        new Date(item.date).toLocaleString()
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `all-pin-exports-${Date.now()}.csv`);
    a.click();
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Export</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and export your recent Pinterest pin analyses
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Recent Analyses</h2>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-auto">
                <Input
                  type="text"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-full"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <Button 
                onClick={handleDownloadAll}
                className="gap-2 whitespace-nowrap"
                disabled={filteredHistory.length === 0}
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-0">
          {filteredHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.url}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.slice(0, 3).map((keyword, i) => (
                          <span key={i} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-800 dark:text-gray-200">
                            {keyword}
                          </span>
                        ))}
                        {item.keywords.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-800 dark:text-gray-200">
                            +{item.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(item)}
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
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No results found. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExportPage;
