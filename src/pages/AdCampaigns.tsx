import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AreaChart } from "@/components/ui/charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, Bell, ChevronDown, ChevronUp, CircleDollarSign, DollarSign, HelpCircle, Info, Link2, PieChart, Plus, Settings2, Target, Trash2, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";
import { Link } from "react-router-dom";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { isAfter } from "@/utils/chartUtils";

const adCampaignFormSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters." }),
  objective: z.enum(["awareness", "traffic", "engagement", "leads", "sales"]),
  budget: z.number().min(10, { message: "Minimum budget is $10." }),
  startDate: z.date(),
  endDate: z.date(),
  targetAudience: z.string().optional(),
  demographics: z.object({
    age: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    location: z.string().optional(),
  }).optional(),
  placement: z.enum(["auto", "manual"]).default("auto"),
  pins: z.array(z.string()).optional(),
  status: z.enum(["active", "paused", "draft"]).default("draft"),
  notes: z.string().optional(),
});

type AdCampaignFormValues = z.infer<typeof adCampaignFormSchema>;

const AdCampaigns = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [pins, setPins] = useState<any[]>([]);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  
  const form = useForm<AdCampaignFormValues>({
    resolver: zodResolver(adCampaignFormSchema),
    defaultValues: {
      name: "",
      objective: "traffic",
      budget: 50,
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      placement: "auto",
    },
  });
  
  const sampleCampaignData = {
    impressions: {
      total: 123456,
      daily: [
        { date: "2023-01-01", value: 1200 },
        { date: "2023-01-02", value: 1350 },
        { date: "2023-01-03", value: 1480 },
        { date: "2023-01-04", value: 1520 },
        { date: "2023-01-05", value: 1650 },
        { date: "2023-01-06", value: 1780 },
        { date: "2023-01-07", value: 1820 },
      ]
    },
    clicks: {
      total: 4567,
      daily: [
        { date: "2023-01-01", value: 450 },
        { date: "2023-01-02", value: 480 },
        { date: "2023-01-03", value: 520 },
        { date: "2023-01-04", value: 550 },
        { date: "2023-01-05", value: 580 },
        { date: "2023-01-06", value: 620 },
        { date: "2023-01-07", value: 650 },
      ]
    },
    cost: {
      total: 123.45,
      daily: [
        { date: "2023-01-01", value: 15.50 },
        { date: "2023-01-02", value: 16.20 },
        { date: "2023-01-03", value: 17.80 },
        { date: "2023-01-04", value: 18.10 },
        { date: "2023-01-05", value: 19.50 },
        { date: "2023-01-06", value: 20.20 },
        { date: "2023-01-07", value: 21.10 },
      ]
    },
    conversions: {
      total: 123,
      daily: [
        { date: "2023-01-01", value: 15 },
        { date: "2023-01-02", value: 16 },
        { date: "2023-01-03", value: 17 },
        { date: "2023-01-04", value: 18 },
        { date: "2023-01-05", value: 19 },
        { date: "2023-01-06", value: 20 },
        { date: "2023-01-07", value: 21 },
      ]
    }
  };
  
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
  
  useEffect(() => {
    const fetchUserPins = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("pins")
          .select("*")
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching pins:", error);
          return;
        }
        
        setPins(data || []);
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    };
    
    fetchUserPins();
  }, [user]);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user?.id) return;
      
      setFetchingCampaigns(true);
      try {
        const { data, error } = await supabase
          .from("ad_campaigns")
          .select("*")
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching campaigns:", error);
          return;
        }
        
        setCampaigns(data || []);
        
        if (data && data.length > 0 && !selectedCampaign) {
          setSelectedCampaign(data[0]);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setFetchingCampaigns(false);
      }
    };
    
    fetchCampaigns();
  }, [user]);
  
  const onSubmit = async (values: AdCampaignFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to add a campaign");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("ad_campaigns")
        .insert({
          user_id: user.id,
          ...values,
        })
        .select();
        
      if (error) {
        console.error("Error adding campaign:", error);
        toast.error("Failed to add campaign", {
          description: error.message
        });
        return;
      }
      
      toast.success("Ad campaign added successfully");
      
      if (data && data[0]) {
        setCampaigns([...campaigns, data[0]]);
        setSelectedCampaign(data[0]);
      }
      
      setCampaignDialogOpen(false);
      form.reset();
    } catch (err) {
      console.error("Error adding campaign:", err);
      toast.error("Failed to add campaign", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteCampaign = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("ad_campaigns")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error deleting campaign:", error);
        toast.error("Failed to delete campaign", {
          description: error.message
        });
        return;
      }
      
      toast.success("Campaign removed");
      
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      
      if (selectedCampaign && selectedCampaign.id === id) {
        setSelectedCampaign(null);
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
      toast.error("Failed to delete campaign", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  const formatChartData = (data: any) => {
    return data?.map((item: any) => ({
      x: format(new Date(item.date), "MMM dd"),
      y: item.value
    })) || [];
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ad Campaigns</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your Pinterest ad campaigns and track their performance
        </p>
      </div>
      
      {!pinterestConnected && (
        <Alert className="mb-6 border-yellow-600 bg-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Pinterest account not connected</AlertTitle>
          <AlertDescription>
            Connect your Pinterest account in Settings to create and manage ad campaigns.
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
                <CardTitle>Campaigns</CardTitle>
                <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Ad Campaign</DialogTitle>
                      <DialogDescription>
                        Set up your Pinterest ad campaign to reach your target audience
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Summer Sale Campaign" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="objective"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Objective</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select objective" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                                  <SelectItem value="traffic">Website Traffic</SelectItem>
                                  <SelectItem value="engagement">Engagement</SelectItem>
                                  <SelectItem value="leads">Lead Generation</SelectItem>
                                  <SelectItem value="sales">Online Sales</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Daily Budget</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  placeholder="50"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  value={field.value}
                                />
                              </FormControl>
                              <FormDescription>Enter your daily budget in USD</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={format(field.value, "PPP")}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(field.value, "PPP")}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        isAfter(date, form.getValues("endDate"))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={format(field.value, "PPP")}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(field.value, "PPP")}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        isAfter(date, new Date()) ||
                                        isAfter(date, form.getValues("startDate"))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Add any notes about this campaign" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Campaign"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Create and manage your Pinterest ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchingCampaigns ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-14 bg-gray-800 rounded w-full"></div>
                  <div className="h-14 bg-gray-800 rounded w-full"></div>
                </div>
              ) : campaigns.length > 0 ? (
                <div className="space-y-2">
                  {campaigns.map(campaign => (
                    <div
                      key={campaign.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedCampaign?.id === campaign.id
                          ? "bg-gray-800 border-l-4 border-pinterest-red"
                          : "hover:bg-gray-900"
                      }`}
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-700 rounded-md mr-3">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <p className="text-xs text-gray-400 capitalize">
                            {campaign.objective} • ${campaign.budget}
                          </p>
                        </div>
                      </div>
                      <Badge className={campaign.status === "active" ? "bg-green-500/20 text-green-500" : campaign.status === "paused" ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-500/20 text-gray-500"}>
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Campaigns Created</h3>
                  <p className="text-gray-400 mb-4">
                    Create your first ad campaign to start promoting your products on Pinterest
                  </p>
                  <Button onClick={() => setCampaignDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedCampaign && (
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link2 className="h-4 w-4 text-gray-400" />
                    <span>Track conversions</span>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings2 className="h-4 w-4 text-gray-400" />
                    <span>Automated bidding</span>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => deleteCampaign(selectedCampaign.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedCampaign ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="pins">Promoted Pins</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-black border-gray-800">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold mb-1">{sampleCampaignData.impressions.total.toLocaleString()}</div>
                        <p className="text-sm text-gray-400">Impressions</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black border-gray-800">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold mb-1">{sampleCampaignData.clicks.total.toLocaleString()}</div>
                        <p className="text-sm text-gray-400">Clicks</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black border-gray-800">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold mb-1">${sampleCampaignData.cost.total.toFixed(2)}</div>
                        <p className="text-sm text-gray-400">Cost</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black border-gray-800">
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold mb-1">{sampleCampaignData.conversions.total.toLocaleString()}</div>
                        <p className="text-sm text-gray-400">Conversions</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-black border-gray-800">
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                      <CardDescription>
                        Track your campaign performance over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <AreaChart
                        data={[
                          {
                            name: "Impressions",
                            data: formatChartData(sampleCampaignData.impressions.daily)
                          },
                          {
                            name: "Clicks",
                            data: formatChartData(sampleCampaignData.clicks.daily)
                          },
                          {
                            name: "Cost",
                            data: formatChartData(sampleCampaignData.cost.daily)
                          }
                        ]}
                        categories={formatChartData(sampleCampaignData.impressions.daily)?.map((item: any) => item.x)}
                        valueFormatter={(value: number) => 
                          isNaN(value) ? "0" : value.toFixed(0)
                        }
                        yAxisWidth={60}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="targeting">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Targeting Settings</CardTitle>
                    <CardDescription>
                      Manage your campaign's targeting options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Target Audience</FormLabel>
                          <Input placeholder="e.g., DIY enthusiasts, Home decor lovers" disabled />
                        </div>
                        <div>
                          <FormLabel>Demographics</FormLabel>
                          <Input placeholder="e.g., Age: 25-45, Gender: Female, Location: US" disabled />
                        </div>
                      </div>
                      
                      <div>
                        <FormLabel>Placement</FormLabel>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Automatic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Targeting Tips</AlertTitle>
                        <AlertDescription>
                          Refine your targeting to reach the right audience and improve campaign performance
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pins">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Promoted Pins</CardTitle>
                    <CardDescription>
                      Select the pins you want to promote in this campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!pinterestConnected ? (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium mb-2">Pinterest Account Not Connected</h3>
                        <p className="text-gray-400 mb-4">
                          Connect your Pinterest account to select pins for your campaign
                        </p>
                        <Button asChild>
                          <Link to="/settings">Go to Settings</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pins.length > 0 ? (
                          pins.map(pin => (
                            <Card key={pin.id} className="bg-gray-900 border-gray-700">
                              <CardHeader>
                                <CardTitle className="text-sm font-medium">{pin.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <img 
                                  src={pin.image} 
                                  alt={pin.title} 
                                  className="w-full h-32 object-cover rounded-md mb-3"
                                />
                                <p className="text-xs text-gray-400">{pin.description}</p>
                              </CardContent>
                              <CardFooter>
                                <Button variant="outline" size="sm">
                                  Promote Pin
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8 col-span-3">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-xl font-medium mb-2">No Pins Found</h3>
                            <p className="text-gray-400 mb-4">
                              Create pins to promote in your campaign
                            </p>
                            <Button asChild>
                              <Link to="/create-pin">Create Pin</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Campaign Settings</CardTitle>
                    <CardDescription>
                      Manage your campaign settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Campaign Status</FormLabel>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Active" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <FormLabel>Campaign Notes</FormLabel>
                        <Textarea placeholder="Add any notes about this campaign" disabled />
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Campaign Tips</AlertTitle>
                        <AlertDescription>
                          Review your campaign settings to ensure optimal performance
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-black border-gray-800 h-full flex items-center justify-center">
              <CardContent className="p-6 text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Campaign Selected</h3>
                <p className="text-gray-400 mb-4">
                  Select a campaign to view its details and manage settings
                </p>
                <Button onClick={() => setCampaignDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdCampaigns;
