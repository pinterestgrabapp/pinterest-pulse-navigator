
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { runPinterestAnalytics, getPreviousAnalytics } from '@/services/pinterestAnalyticsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface AnalyticsEngineProps {
  onAnalysisComplete?: (result: any) => void;
}

const AnalyticsEngine: React.FC<AnalyticsEngineProps> = ({ onAnalysisComplete }) => {
  const [query, setQuery] = useState('');
  const [analysisType, setAnalysisType] = useState<'pin' | 'profile' | 'keyword'>('keyword');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use Pinterest Analytics',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const analysisResult = await runPinterestAnalytics(user.id, { 
        type: analysisType, 
        query 
      });
      
      setResult(analysisResult);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
      
      toast({
        title: 'Analysis Complete',
        description: `Successfully analyzed ${analysisType}: ${query}`
      });
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Unable to complete analysis',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pinterest Analytics Engine</CardTitle>
        <CardDescription>
          Analyze Pinterest content by keyword, pin, or profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <select 
            value={analysisType} 
            onChange={(e) => setAnalysisType(e.target.value as any)}
            className="border rounded p-2"
          >
            <option value="keyword">Keyword</option>
            <option value="pin">Pin</option>
            <option value="profile">Profile</option>
          </select>
          <Input 
            placeholder={`Enter ${analysisType}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={!query || isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {result && (
          <div>
            <h3>Analysis Results</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsEngine;
