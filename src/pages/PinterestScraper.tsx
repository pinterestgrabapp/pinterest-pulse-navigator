
import DashboardLayout from "@/components/layout/DashboardLayout";
import ApifyPinterestScraper from "@/components/ApifyPinterestScraper";

const PinterestScraperPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pinterest Scraper</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Extract data from Pinterest using the Apify scraper. Search for pins, analyze accounts, or explore boards.
        </p>
      </div>
      
      <div className="space-y-6">
        <ApifyPinterestScraper />
      </div>
    </DashboardLayout>
  );
};

export default PinterestScraperPage;
