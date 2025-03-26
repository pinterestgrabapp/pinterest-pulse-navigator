
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/utils/languageUtils";
import { Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const dummyPins = [
  {
    id: 1,
    title: "10 Essential Pinterest SEO Tips",
    thumbnail: "https://via.placeholder.com/150x250",
    saves: 243,
    views: 1205,
    date: "2023-06-15",
  },
  {
    id: 2,
    title: "How to Create Perfect Pinterest Pins",
    thumbnail: "https://via.placeholder.com/150x300",
    saves: 187,
    views: 956,
    date: "2023-06-02",
  },
  {
    id: 3,
    title: "Pinterest Keyword Research Guide",
    thumbnail: "https://via.placeholder.com/150x200",
    saves: 312,
    views: 1845,
    date: "2023-05-28",
  },
  {
    id: 4,
    title: "Pinterest Marketing Strategy for 2023",
    thumbnail: "https://via.placeholder.com/150x280",
    saves: 176,
    views: 892,
    date: "2023-05-15",
  },
];

const SavedPins = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Pins</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and organize your saved Pinterest pins
        </p>
      </div>
      
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Your Collections</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Organize your pins into collections
            </p>
          </div>
          <Button variant="outline" size="sm">
            Create Collection
          </Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:border-pinterest-red transition-colors">
              <Bookmark className="h-5 w-5 text-pinterest-red" />
              <div>
                <h3 className="font-medium">SEO Tips</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">15 pins</p>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:border-pinterest-red transition-colors">
              <Bookmark className="h-5 w-5 text-pinterest-red" />
              <div>
                <h3 className="font-medium">Design Inspiration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">23 pins</p>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:border-pinterest-red transition-colors">
              <Bookmark className="h-5 w-5 text-pinterest-red" />
              <div>
                <h3 className="font-medium">Marketing Strategies</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">8 pins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recently Saved Pins</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your most recently saved Pinterest pins
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dummyPins.map(pin => (
              <div key={pin.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-pinterest-red transition-colors">
                <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                  <img 
                    src={pin.thumbnail} 
                    alt={pin.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2">{pin.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{pin.saves} saves</span>
                    <span>{pin.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedPins;
