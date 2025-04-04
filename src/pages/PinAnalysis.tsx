
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PinAnalyzer from "@/components/PinAnalyzer";
import AccountAnalyzer from "@/components/AccountAnalyzer";
import AnalyticsEngine from "@/components/AnalyticsEngine";
import { useLanguage } from "@/utils/languageUtils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const PinAnalysis = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("pins");
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('pinAnalysis')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('pinAnalysisDescription')}
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="pins">Analyze Pins</TabsTrigger>
          <TabsTrigger value="accounts">Analyze Accounts</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pins">
          <div className="bg-black rounded-xl border border-gray-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">{t('pinAnalyzer')}</h2>
              <p className="text-sm text-gray-400">
                {t('pinAnalyzerDescription')}
              </p>
            </div>
            <div className="p-6">
              <PinAnalyzer />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="accounts">
          <div className="bg-black rounded-xl border border-gray-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Account Analyzer</h2>
              <p className="text-sm text-gray-400">
                Analyze any Pinterest account to see their top pins, interests, and statistics
              </p>
            </div>
            <div className="p-6">
              <AccountAnalyzer />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="bg-black rounded-xl border border-gray-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Advanced Analytics Engine</h2>
              <p className="text-sm text-gray-400">
                Powerful insights for pins, accounts and keywords with AI-powered analysis
              </p>
            </div>
            <div className="p-6">
              <AnalyticsEngine />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PinAnalysis;
