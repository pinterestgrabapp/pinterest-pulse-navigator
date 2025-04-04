
import DashboardLayout from "@/components/layout/DashboardLayout";
import PinterestAnalytics from "@/components/PinterestAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/utils/languageUtils";

const PinterestAnalyticsPage = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pinterest Analytics Engine</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Deep analytics for Pinterest keywords, pins, and profiles
        </p>
      </div>
      
      <Card className="glass-card bg-black">
        <CardHeader>
          <CardTitle>Pinterest Analytics</CardTitle>
          <CardDescription>
            Analyze keywords, pins, or profiles to discover trends and optimize your Pinterest strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PinterestAnalytics />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PinterestAnalyticsPage;
