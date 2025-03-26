
import DashboardLayout from "@/components/layout/DashboardLayout";
import PinAnalyzer from "@/components/PinAnalyzer";
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
      
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{t('pinAnalyzer')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('pinAnalyzerDescription')}
          </p>
        </div>
        <div className="p-6">
          <PinAnalyzer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PinAnalysis;
