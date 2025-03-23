
import DashboardLayout from "@/components/layout/DashboardLayout";
import PinAnalyzer from "@/components/PinAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/utils/languageUtils";

const PinAnalysis = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('pinAnalysis')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('pinAnalysisDescription')}
        </p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{t('pinAnalyzer')}</CardTitle>
          <CardDescription>
            {t('pinAnalyzerDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PinAnalyzer />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PinAnalysis;
