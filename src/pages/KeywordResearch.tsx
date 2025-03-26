
import DashboardLayout from "@/components/layout/DashboardLayout";
import KeywordExplorer from "@/components/KeywordExplorer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/utils/languageUtils";

const KeywordResearch = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('keywordResearch')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover high-performing Pinterest keywords and track your rankings
        </p>
      </div>
      
      <Card className="glass-card bg-white dark:bg-black">
        <CardHeader>
          <CardTitle>Pinterest Keyword Explorer</CardTitle>
          <CardDescription>
            Search over 12 million Pinterest interests and keywords to find the best ones for your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordExplorer />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default KeywordResearch;
