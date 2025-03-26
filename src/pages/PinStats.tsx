
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/utils/languageUtils";
import { BarChart4, TrendingUp } from "lucide-react";

const PinStats = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pin Statistics</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track and analyze the performance of your Pinterest pins
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Impressions</h3>
            <TrendingUp className="h-6 w-6 text-pinterest-red" />
          </div>
          <p className="text-3xl font-bold">24,892</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">+12.5% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Saves</h3>
            <BarChart4 className="h-6 w-6 text-pinterest-red" />
          </div>
          <p className="text-3xl font-bold">1,843</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">+8.2% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Average Engagement</h3>
            <BarChart4 className="h-6 w-6 text-pinterest-red" />
          </div>
          <p className="text-3xl font-bold">6.5%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">+2.1% from last month</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Pin Performance History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track how your pins are performing over time
          </p>
        </div>
        <div className="p-6">
          <div className="h-72 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart data will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PinStats;
