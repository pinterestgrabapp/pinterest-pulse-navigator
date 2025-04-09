
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { searchPinterest, scrapeUrl, scrapeBoard } from "@/utils/apifyUtils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface PinterestPin {
  title: string;
  description?: string;
  pinUrl: string;
  imageUrl: string;
  userName?: string;
  repins?: number;
  savedCount?: number;
}

const ApifyPinterestScraper = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [boardUrl, setBoardUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PinterestPin[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const data = await searchPinterest(searchQuery);
      if (data && data.length > 0) {
        setResults(data);
        toast.success(`Found ${data.length} results for "${searchQuery}"`);
      } else {
        toast.error("No results found. Try a different query.");
      }
    } catch (error) {
      console.error("Pinterest search error:", error);
      toast.error("Failed to search Pinterest");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlScrape = async () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a Pinterest URL");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const data = await scrapeUrl(urlInput);
      if (data && data.length > 0) {
        setResults(data);
        toast.success(`Successfully scraped ${data.length} pins`);
      } else {
        toast.error("Failed to scrape URL or no data found");
      }
    } catch (error) {
      console.error("URL scrape error:", error);
      toast.error("Failed to scrape Pinterest URL");
    } finally {
      setLoading(false);
    }
  };

  const handleBoardScrape = async () => {
    if (!boardUrl.trim()) {
      toast.error("Please enter a Pinterest board URL");
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const data = await scrapeBoard(boardUrl);
      if (data && data.length > 0) {
        setResults(data);
        toast.success(`Successfully scraped ${data.length} pins from board`);
      } else {
        toast.error("Failed to scrape board or no pins found");
      }
    } catch (error) {
      console.error("Board scrape error:", error);
      toast.error("Failed to scrape Pinterest board");
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (results.length === 0) {
      toast.error("No results to download");
      return;
    }

    // Convert results to CSV
    const headers = ["Title", "Description", "URL", "Image URL", "User", "Repins", "Saves"];
    const rows = results.map(pin => [
      pin.title || "",
      pin.description || "",
      pin.pinUrl || "",
      pin.imageUrl || "",
      pin.userName || "",
      pin.repins?.toString() || "0",
      pin.savedCount?.toString() || "0"
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pinterest-scrape-${Date.now()}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Results exported to CSV");
  };

  return (
    <div className="w-full">
      <Card className="border border-gray-700 bg-black text-white">
        <CardHeader>
          <CardTitle>Pinterest Data Scraper</CardTitle>
          <CardDescription className="text-gray-400">
            Search for pins, scrape specific URLs, or extract pins from boards using the Apify Pinterest scraper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="url">Pin/Account URL</TabsTrigger>
              <TabsTrigger value="board">Board</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keywords to search on Pinterest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={loading || !searchQuery.trim()}
                  className="bg-pinterest-red hover:bg-pinterest-red/80"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Pinterest pin or profile URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUrlScrape} 
                  disabled={loading || !urlInput.trim()}
                  className="bg-pinterest-red hover:bg-pinterest-red/80"
                >
                  {loading ? "Scraping..." : "Scrape"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="board" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Pinterest board URL..."
                  value={boardUrl}
                  onChange={(e) => setBoardUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleBoardScrape} 
                  disabled={loading || !boardUrl.trim()}
                  className="bg-pinterest-red hover:bg-pinterest-red/80"
                >
                  {loading ? "Scraping..." : "Scrape Board"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          {/* Results Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Results {results.length > 0 && `(${results.length})`}
              </h3>
              {results.length > 0 && (
                <Button size="sm" variant="outline" onClick={downloadResults}>
                  Export CSV
                </Button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border border-gray-800 bg-gray-950">
                    <div className="p-2">
                      <Skeleton className="h-40 w-full bg-gray-800" />
                      <Skeleton className="h-4 w-3/4 mt-4 bg-gray-800" />
                      <Skeleton className="h-3 w-1/2 mt-2 bg-gray-800" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((pin, index) => (
                  <Card key={index} className="overflow-hidden border border-gray-800 bg-gray-950 hover:border-gray-700 transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={pin.imageUrl} 
                        alt={pin.title} 
                        className="object-cover w-full h-full hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-white line-clamp-2 h-12">{pin.title}</h4>
                      {pin.description && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {pin.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{pin.userName || "Unknown"}</span>
                        <div className="flex gap-2">
                          <span>❤️ {pin.savedCount || 0}</span>
                          <span>🔄 {pin.repins || 0}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="p-0 h-auto text-pinterest-red mt-2"
                        onClick={() => window.open(pin.pinUrl, '_blank')}
                      >
                        View on Pinterest
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {activeTab === "search" 
                    ? "Search for Pinterest pins using keywords" 
                    : activeTab === "url" 
                    ? "Enter a Pinterest pin or account URL to scrape" 
                    : "Enter a Pinterest board URL to extract all pins"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApifyPinterestScraper;
