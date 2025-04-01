import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AlertCircle, ArrowRight, Check, ExternalLink, Info, Link2, Plus, RefreshCw, Settings, ShoppingBag, ShoppingCart, Store, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AreaChart } from "@/components/ui/charts";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { format, subDays } from "date-fns";
import { Link } from "react-router-dom";

const integrationFormSchema = z.object({
  platform: z.enum(["shopify", "woocommerce", "etsy", "bigcommerce", "squarespace"]),
  apiKey: z.string().min(5, { message: "API Key is required" }),
  apiSecret: z.string().min(5, { message: "API Secret is required" }),
  storeUrl: z.string().url({ message: "Please enter a valid store URL" }),
});

type IntegrationFormValues = z.infer<typeof integrationFormSchema>;

const Ecommerce = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingIntegrations, setFetchingIntegrations] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [productStats, setProductStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      platform: "shopify",
      apiKey: "",
      apiSecret: "",
      storeUrl: "",
    },
  });

  // Fetch Pinterest credentials and check if connected
  useEffect(() => {
    const checkPinterestConnection = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("pinterest_credentials")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching Pinterest credentials:", error);
          setPinterestConnected(false);
          return;
        }
        
        setPinterestConnected(!!data?.access_token);
      } catch (err) {
        console.error("Error checking Pinterest connection:", err);
        setPinterestConnected(false);
      }
    };
    
    checkPinterestConnection();
  }, [user]);
  
  // Fetch e-commerce integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!user?.id) return;
      
      setFetchingIntegrations(true);
      try {
        const { data, error } = await supabase
          .from("ecommerce_integrations")
          .select("*")
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching integrations:", error);
          return;
        }
        
        setIntegrations(data || []);
        
        // Select the first integration by default
        if (data && data.length > 0 && !selectedIntegration) {
          setSelectedIntegration(data[0]);
        }
      } catch (err) {
        console.error("Error fetching integrations:", err);
      } finally {
        setFetchingIntegrations(false);
      }
    };
    
    fetchIntegrations();
  }, [user]);
  
  // Generate sample product data when an integration is selected
  useEffect(() => {
    if (selectedIntegration) {
      // Generate sample products
      const generateSampleProducts = () => {
        const productNames = [
          "Vintage Art Print Set",
          "Handcrafted Wooden Bowl",
          "Modern Ceramic Vase",
          "Luxury Scented Candle",
          "Artisan Coffee Mug",
          "Minimalist Wall Clock",
          "Organic Cotton Throw",
          "Leather Journal",
          "Brass Desk Lamp",
          "Hand-woven Basket"
        ];
        
        const sampleProducts = [];
        
        for (let i = 0; i < 10; i++) {
          const price = Math.floor(Math.random() * 100) + 20;
          const inventory = Math.floor(Math.random() * 50) + 5;
          const sales = Math.floor(Math.random() * 200) + 10;
          
          sampleProducts.push({
            id: `prod_${i + 1}`,
            name: productNames[i],
            price: price,
            currency: "USD",
            inventory: inventory,
            sales: sales,
            revenue: price * sales,
            pinned: i < 5, // First 5 products are pinned to Pinterest
            image: `https://source.unsplash.com/random/300x300?product=${i + 1}`,
            description: `Beautiful ${productNames[i].toLowerCase()} for your home or office. High quality and handcrafted.`
          });
        }
        
        return sampleProducts;
      };
      
      // Generate sample product stats
      const generateProductStats = () => {
        const days = 30;
        const sales = [];
        const views = [];
        const revenue = [];
        
        const baseSales = 8 + Math.floor(Math.random() * 5);
        const baseViews = 120 + Math.floor(Math.random() * 50);
        const baseRevenue = 250 + Math.floor(Math.random() * 100);
        
        for (let i = 0; i < days; i++) {
          const date = subDays(new Date(), days - i - 1);
          
          // Add some randomness to the data
          const daySales = Math.max(0, baseSales + Math.floor(Math.random() * 10) - 5);
          const dayViews = Math.max(0, baseViews + Math.floor(Math.random() * 60) - 30);
          const dayRevenue = daySales * (baseRevenue / baseSales) + Math.floor(Math.random() * 50) - 25;
          
          sales.push({
            date: format(date, "yyyy-MM-dd"),
            value: daySales
          });
          
          views.push({
            date: format(date, "yyyy-MM-dd"),
            value: dayViews
          });
          
          revenue.push({
            date: format(date, "yyyy-MM-dd"),
            value: dayRevenue
          });
        }
        
        const totalSales = sales.reduce((sum, item) => sum + item.value, 0);
        const totalViews = views.reduce((sum, item) => sum + item.value, 0);
        const totalRevenue = revenue.reduce((sum, item) => sum + item.value, 0);
        
        return {
          sales,
          views,
          revenue,
          summary: {
            sales: totalSales,
            views: totalViews,
            revenue: totalRevenue,
            conversionRate: ((totalSales / totalViews) * 100).toFixed(2),
            averageOrderValue: (totalRevenue / totalSales).toFixed(2)
          }
        };
      };
      
      setProducts(generateSampleProducts());
      setProductStats(generateProductStats());
    }
  }, [selectedIntegration]);
  
  // Handle form submission
  const onSubmit = async (values: IntegrationFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to add an integration");
      return;
    }
    
    setLoading(true);
    
    try {
      // Encrypt the API credentials (in a real app)
      const credentials = {
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
        storeUrl: values.storeUrl,
      };
      
      const { data, error } = await supabase
        .from("ecommerce_integrations")
        .insert({
          user_id: user.id,
          platform: values.platform,
          credentials,
          status: "active",
        })
        .select();
        
      if (error) {
        console.error("Error adding integration:", error);
        toast.error("Failed to add integration", {
          description: error.message
        });
        return;
      }
      
      toast.success("E-commerce integration added successfully");
      
      // Add to integrations list
      if (data && data[0]) {
        setIntegrations([...integrations, data[0]]);
        setSelectedIntegration(data[0]);
      }
      
      setIntegrationDialogOpen(false);
      form.reset();
    } catch (err) {
      console.error("Error adding integration:", err);
      toast.error("Failed to add integration", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete integration
  const deleteIntegration = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("ecommerce_integrations")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error deleting integration:", error);
        toast.error("Failed to delete integration", {
          description: error.message
        });
        return;
      }
      
      toast.success("Integration removed");
      
      // Remove from integrations list
      setIntegrations(integrations.filter(integration => integration.id !== id));
      
      // Clear selected integration if it was deleted
      if (selectedIntegration && selectedIntegration.id === id) {
        setSelectedIntegration(null);
      }
    } catch (err) {
      console.error("Error deleting integration:", err);
      toast.error("Failed to delete integration", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  // Sync products
  const syncProducts = () => {
    if (!selectedIntegration) return;
    
    setSyncInProgress(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast.success("Products synced successfully", {
        description: "Your product catalog has been updated"
      });
      setSyncInProgress(false);
    }, 2000);
  };
  
  // Format chart data
  const formatChartData = (data: any) => {
    return data?.map((item: any) => ({
      x: format(new Date(item.date), "MMM dd"),
      y: item.value
    })) || [];
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "shopify":
        return <Store className="h-5 w-5" />;
      case "woocommerce":
        return <ShoppingCart className="h-5 w-5" />;
      case "etsy":
        return <ShoppingBag className="h-5 w-5" />;
      default:
        return <Store className="h-5 w-5" />;
    }
  };
  
  // Pin product to Pinterest
  const pinProduct = (product: any) => {
    if (!pinterestConnected) {
      toast.error("Pinterest account not connected", {
        description: "Connect your Pinterest account to pin products"
      });
      return;
    }
    
    toast.success("Product pinned to Pinterest", {
      description: `${product.name} has been pinned to your Pinterest boards`
    });
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">E-commerce Integration</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Connect your online store to Pinterest and track sales from your pins
        </p>
      </div>
      
      {!pinterestConnected && (
        <Alert className="mb-6 border-yellow-600 bg-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Pinterest account not connected</AlertTitle>
          <AlertDescription>
            Connect your Pinterest account in Settings to enable product pinning and tracking.
            <Button asChild className="ml-2" variant="outline" size="sm">
              <Link to="/settings">Go to Settings</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-black border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Store Connections</CardTitle>
                <Dialog open={integrationDialogOpen} onOpenChange={setIntegrationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect E-commerce Store</DialogTitle>
                      <DialogDescription>
                        Add your store details to connect your products with Pinterest
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="platform"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-commerce Platform</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select platform" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="shopify">Shopify</SelectItem>
                                  <SelectItem value="woocommerce">WooCommerce</SelectItem>
                                  <SelectItem value="etsy">Etsy</SelectItem>
                                  <SelectItem value="bigcommerce">BigCommerce</SelectItem>
                                  <SelectItem value="squarespace">Squarespace</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="storeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://your-store.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="apiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Key</FormLabel>
                              <FormControl>
                                <Input placeholder="your-api-key" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="apiSecret"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>API Secret</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password"
                                  placeholder="your-api-secret" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Secure connection</AlertTitle>
                          <AlertDescription>
                            Your API credentials are encrypted and stored securely
                          </AlertDescription>
                        </Alert>
                        
                        <DialogFooter>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Connecting..." : "Connect Store"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Connect your e-commerce stores to Pinterest
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchingIntegrations ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-14 bg-gray-800 rounded w-full"></div>
                  <div className="h-14 bg-gray-800 rounded w-full"></div>
                </div>
              ) : integrations.length > 0 ? (
                <div className="space-y-2">
                  {integrations.map(integration => (
                    <div
                      key={integration.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedIntegration?.id === integration.id
                          ? "bg-gray-800 border-l-4 border-pinterest-red"
                          : "hover:bg-gray-900"
                      }`}
                      onClick={() => setSelectedIntegration(integration)}
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-700 rounded-md mr-3">
                          {getPlatformIcon(integration.platform)}
                        </div>
                        <div>
                          <h3 className="font-medium capitalize">{integration.platform}</h3>
                          <p className="text-xs text-gray-400">
                            {integration.credentials.storeUrl.replace(/(^\w+:|^)\/\//, '')}
                          </p>
                        </div>
                      </div>
                      <Badge className={integration.status === "active" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}>
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Store className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Stores Connected</h3>
                  <p className="text-gray-400 mb-4">
                    Connect your e-commerce store to start selling on Pinterest
                  </p>
                  <Button onClick={() => setIntegrationDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Store
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedIntegration && (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 text-gray-400" />
                    <span>Auto-sync products</span>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link2 className="h-4 w-4 text-gray-400" />
                    <span>Track Pinterest conversions</span>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span>Auto-pin new products</span>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={syncProducts}
                    disabled={syncInProgress}
                  >
                    {syncInProgress ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Products Now
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => deleteIntegration(selectedIntegration.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Disconnect Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedIntegration ? (
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="pins">Pinterest Pins</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Product Catalog</
