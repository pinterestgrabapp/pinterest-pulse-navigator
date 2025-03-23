
import DashboardLayout from "@/components/layout/DashboardLayout";
import KeywordResearchTool from "@/components/KeywordResearchTool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/utils/languageUtils";

const KeywordResearch = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('keywordResearch')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('keywordResearchDescription')}
        </p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t('keywordExplorer')}</CardTitle>
          <CardDescription>
            {t('keywordExplorerDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordResearchTool />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default KeywordResearch;
