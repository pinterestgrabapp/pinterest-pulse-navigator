
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AreaChart } from "@/components/ui/chart";
import { CalendarIcon, Clock, DollarSign, Edit, Eye, ExternalLink, Pause, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const campaignFormSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters" }),
  budget: z.number().min(1, { message: "Budget must be at least 1" }),
  startDate: z.date(),
  endDate: z.date().optional(),
  objective: z.enum(["awareness", "consideration", "conversion"]),
  targetAudience: z.string().optional(),
  description: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

const AdCampaigns = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(true);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [campaignStats, setCampaignStats] = useState<any>({});
  
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      budget: 100,
      startDate: new Date(),
      objective: "awareness",
      targetAudience: "",
      description: "",
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
  
  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user?.id) return;
      
      setFetchingCampaigns(true);
      try {
        const { data, error } = await supabase
          .from("ad_campaigns")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching campaigns:", error);
          return;
        }
        
        setCampaigns(data || []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setFetchingCampaigns(false);
      }
    };
    
    fetchCampaigns();
  }, [user]);
  
  // Generate sample campaign stats
  useEffect(() => {
    if (selectedCampaign) {
      // Generate sample data for demonstration
      const generateSampleData = () => {
        const days = 14;  // 2 weeks of data
        const impressions = [];
        const clicks = [];
        const conversions = [];
        
        const baseImpressions = Math.floor(Math.random() * 1000) + 500;
        const baseClicks = Math.floor(Math.random() * 50) + 20;
        const baseConversions = Math.floor(Math.random() * 5) + 1;
        
        const startDate = new Date(selectedCampaign.start_date);
        
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          
          const dayImpressions = baseImpressions + Math.floor(Math.random() * 200) - 100;
          const dayClicks = baseClicks + Math.floor(Math.random() * 10) - 5;
          const dayConversions = baseConversions + Math.floor(Math.random() * 3) - 1;
          
          impressions.push({
            date: format(date, "yyyy-MM-dd"),
            value: Math.max(0, dayImpressions)
          });
          
          clicks.push({
            date: format(date, "yyyy-MM-dd"),
            value: Math.max(0, dayClicks)
          });
          
          conversions.push({
            date: format(date, "yyyy-MM-dd"),
            value: Math.max(0, dayConversions)
          });
        }
        
        const totalImpressions = impressions.reduce((sum, item) => sum + item.value, 0);
        const totalClicks = clicks.reduce((sum, item) => sum + item.value, 0);
        const totalConversions = conversions.reduce((sum, item) => sum + item.value, 0);
        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
        const cpa = totalConversions > 0 ? selectedCampaign.budget / totalConversions : 0;
        
        return {
          impressions,
          clicks,
          conversions,
          summary: {
            impressions: totalImpressions,
            clicks: totalClicks,
            conversions: totalConversions,
            ctr: ctr.toFixed(2),
            conversionRate: conversionRate.toFixed(2),
            cpa: cpa.toFixed(2),
            spend: (selectedCampaign.budget * 0.7).toFixed(2), // Simulated partial spend
          }
        };
      };
      
      setCampaignStats(generateSampleData());
    }
  }, [selectedCampaign]);
  
  // Handle form submission
  const onSubmit = async (values: CampaignFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to create campaigns");
      return;
    }
    
    if (!pinterestConnected) {
      toast.error("Pinterest account not connected", {
        description: "Please connect your Pinterest account in Settings to create campaigns"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Create campaign object
      const campaignData = {
        user_id: user.id,
        name: values.name,
        budget: values.budget,
        start_date: values.startDate.toISOString(),
        end_date: values.endDate ? values.endDate.toISOString() : null,
        status: "draft",
        campaign_data: {
          objective: values.objective,
          targetAudience: values.targetAudience || null,
          description: values.description || null,
        }
      };
      
      // Insert campaign
      const { data, error } = await supabase
        .from("ad_campaigns")
        .insert(campaignData)
        .select();
        
      if (error) {
        console.error("Error creating campaign:", error);
        toast.error("Failed to create campaign", {
          description: error.message
        });
        return;
      }
      
      toast.success("Campaign created successfully", {
        description: "Your new campaign has been created in draft status"
      });
      
      // Add to campaigns list
      if (data && data[0]) {
        setCampaigns([data[0], ...campaigns]);
      }
      
      // Reset form
      form.reset({
        name: "",
        budget: 100,
        startDate: new Date(),
        objective: "awareness",
        targetAudience: "",
        description: "",
      });
      
      setCampaignDialogOpen(false);
    } catch (err) {
      console.error("Error creating campaign:", err);
      toast.error("Failed to create campaign", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete campaign
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
      
      // Remove from campaigns list
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      
      // Clear selected campaign if it was deleted
      if (selectedCampaign && selectedCampaign.id === id) {
        setSelectedCampaign(null);
      }
      
      toast.success("Campaign deleted", {
        description: "The campaign has been removed"
      });
    } catch (err) {
      console.error("Error deleting campaign:", err);
      toast.error("Failed to delete campaign", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  // Update campaign status
  const updateCampaignStatus = async (id: string, status: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("ad_campaigns")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error updating campaign status:", error);
        toast.error("Failed to update campaign status", {
          description: error.message
        });
        return;
      }
      
      // Update campaign in list
      setCampaigns(campaigns.map(campaign => 
        campaign.id === id ? { ...campaign, status } : campaign
      ));
      
      // Update selected campaign if it was updated
      if (selectedCampaign && selectedCampaign.id === id) {
        setSelectedCampaign({ ...selectedCampaign, status });
      }
      
      toast.success("Campaign status updated", {
        description: `Campaign is now ${status}`
      });
    } catch (err) {
      console.error("Error updating campaign status:", err);
      toast.error("Failed to update campaign status", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  // Format chart data
  const formatChartData = (data: any) => {
    return data?.map((item: any) => ({
      x: format(new Date(item.date), "MMM dd"),
      y: item.value
    })) || [];
  };
  
  // Get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ad Campaigns</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create, manage, and analyze your Pinterest ad campaigns
        </p>
      </div>
      
      {!pinterestConnected ? (
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle>Connect Your Pinterest Account</CardTitle>
            <CardDescription>
              You need to connect your Pinterest account to manage ad campaigns
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/settings">Go to Settings</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Campaigns</h2>
            
            <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Set up a new Pinterest ad campaign. You'll be able to add pins and targeting after creation.
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
                            <Input placeholder="Summer Sale 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input 
                                type="number" 
                                className="pl-8" 
                                placeholder="100" 
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
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
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
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
                            <FormLabel>End Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value || undefined}
                                  onSelect={field.onChange}
                                  initialFocus
                                  disabled={(date) => date < form.getValues().startDate}
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
                                <SelectValue placeholder="Select an objective" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="awareness">Brand Awareness</SelectItem>
                              <SelectItem value="consideration">Consideration</SelectItem>
                              <SelectItem value="conversion">Conversion</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Women 25-34, Home Decor Enthusiasts" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add details about your campaign objectives and goals" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Alert>
                      <AlertTitle className="flex items-center">
                        <InfoIcon className="h-4 w-4 mr-2" />
                        Draft Mode
                      </AlertTitle>
                      <AlertDescription>
                        Your campaign will be created in draft mode. You can activate it later when ready.
                      </AlertDescription>
                    </Alert>
                    
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {fetchingCampaigns ? (
                <Card className="bg-black border-gray-800">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-800 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-800 rounded"></div>
                      <div className="h-10 bg-gray-800 rounded"></div>
                      <div className="h-10 bg-gray-800 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : campaigns.length > 0 ? (
                campaigns.map(campaign => (
                  <Card 
                    key={campaign.id} 
                    className={`bg-black border-gray-800 cursor-pointer transition-all ${selectedCampaign?.id === campaign.id ? 'ring-2 ring-pinterest-red' : 'hover:border-gray-600'}`}
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-base">{campaign.name}</h3>
                        <Badge className={getStatusBadgeColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-3">
                        <div>Budget: ${campaign.budget}</div>
                        <div>Start: {format(new Date(campaign.start_date), "MMM d, yyyy")}</div>
                        {campaign.end_date && (
                          <div>End: {format(new Date(campaign.end_date), "MMM d, yyyy")}</div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCampaignStatus(campaign.id, 'active');
                            }}
                          >
                            <Play className="mr-1 h-4 w-4" />
                            Activate
                          </Button>
                        )}
                        
                        {campaign.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCampaignStatus(campaign.id, 'paused');
                            }}
                          >
                            <Pause className="mr-1 h-4 w-4" />
                            Pause
                          </Button>
                        )}
                        
                        {campaign.status === 'paused' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCampaignStatus(campaign.id, 'active');
                            }}
                          >
                            <Play className="mr-1 h-4 w-4" />
                            Resume
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCampaign(campaign.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-black border-gray-800">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Campaigns</h3>
                    <p className="text-gray-400 mb-4">
                      You haven't created any ad campaigns yet.
                    </p>
                    <Button onClick={() => setCampaignDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-2">
              {selectedCampaign ? (
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedCampaign.name}</CardTitle>
                        <CardDescription>
                          Campaign created on {format(new Date(selectedCampaign.created_at), "MMMM d, yyyy")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadgeColor(selectedCampaign.status)}>
                        {selectedCampaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Impressions</h4>
                          <div className="text-2xl font-bold">{campaignStats.summary?.impressions.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Clicks</h4>
                          <div className="text-2xl font-bold">{campaignStats.summary?.clicks.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">CTR</h4>
                          <div className="text-2xl font-bold">{campaignStats.summary?.ctr}%</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-1">Spent</h4>
                          <div className="text-2xl font-bold">${campaignStats.summary?.spend}</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-base">Campaign Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 h-[300px]">
                        <AreaChart
                          data={[
                            {
                              name: "Impressions",
                              data: formatChartData(campaignStats.impressions)
                            },
                            {
                              name: "Clicks",
                              data: formatChartData(campaignStats.clicks)
                            }
                          ]}
                          categories={formatChartData(campaignStats.impressions)?.map((item: any) => item.x)}
                          valueFormatter={(value: number) => value.toLocaleString()}
                          yAxisWidth={60}
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">Campaign Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <dl className="space-y-2 text-sm">
                            <div className="grid grid-cols-3 gap-1">
                              <dt className="text-gray-400">Budget:</dt>
                              <dd className="col-span-2">${selectedCampaign.budget}</dd>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <dt className="text-gray-400">Start Date:</dt>
                              <dd className="col-span-2">{format(new Date(selectedCampaign.start_date), "MMMM d, yyyy")}</dd>
                            </div>
                            {selectedCampaign.end_date && (
                              <div className="grid grid-cols-3 gap-1">
                                <dt className="text-gray-400">End Date:</dt>
                                <dd className="col-span-2">{format(new Date(selectedCampaign.end_date), "MMMM d, yyyy")}</dd>
                              </div>
                            )}
                            <div className="grid grid-cols-3 gap-1">
                              <dt className="text-gray-400">Objective:</dt>
                              <dd className="col-span-2 capitalize">{selectedCampaign.campaign_data?.objective || "Not specified"}</dd>
                            </div>
                            {selectedCampaign.campaign_data?.targetAudience && (
                              <div className="grid grid-cols-3 gap-1">
                                <dt className="text-gray-400">Target Audience:</dt>
                                <dd className="col-span-2">{selectedCampaign.campaign_data.targetAudience}</dd>
                              </div>
                            )}
                            {selectedCampaign.campaign_data?.description && (
                              <div className="grid grid-cols-3 gap-1">
                                <dt className="text-gray-400">Description:</dt>
                                <dd className="col-span-2">{selectedCampaign.campaign_data.description}</dd>
                              </div>
                            )}
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-700">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">Campaign Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {selectedCampaign.status === 'draft' && (
                              <Button 
                                className="w-full"
                                onClick={() => updateCampaignStatus(selectedCampaign.id, 'active')}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Activate Campaign
                              </Button>
                            )}
                            
                            {selectedCampaign.status === 'active' && (
                              <Button 
                                className="w-full"
                                onClick={() => updateCampaignStatus(selectedCampaign.id, 'paused')}
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Pause Campaign
                              </Button>
                            )}
                            
                            {selectedCampaign.status === 'paused' && (
                              <Button 
                                className="w-full"
                                onClick={() => updateCampaignStatus(selectedCampaign.id, 'active')}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Resume Campaign
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                // In a real app, this would navigate to the edit page
                                toast.info("Edit functionality would be implemented here");
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Campaign
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                // In a real app, this would open the ads manager
                                toast.info("Pinterest Ads Manager integration would open here");
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open in Pinterest Ads Manager
                            </Button>
                            
                            <Button 
                              variant="destructive" 
                              className="w-full"
                              onClick={() => deleteCampaign(selectedCampaign.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Campaign
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">Campaign Ads</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ad Name</TableHead>
                              <TableHead>Format</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Impressions</TableHead>
                              <TableHead>Clicks</TableHead>
                              <TableHead>CTR</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-4">
                                <div className="flex flex-col items-center">
                                  <p className="text-gray-400 mb-2">No ads have been created for this campaign yet.</p>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      // In a real app, this would open the ad creation form
                                      toast.info("Ad creation functionality would be implemented here");
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Ad
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black border-gray-800 h-full flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Select a Campaign</h3>
                    <p className="text-gray-400">
                      Click on a campaign from the list to view its details and performance
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdCampaigns;
