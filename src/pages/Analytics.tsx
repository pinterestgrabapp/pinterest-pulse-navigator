import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getPinterestCredentials } from "@/utils/pinterestApiUtils";
import { formatChartData, exportAnalytics } from "@/utils/chartUtils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AreaChart, BarChart, DonutChart, LineChart } from "@/components/ui/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, RefreshCw } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { Link } from "react-router-dom";

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>({});
  const [timeframe, setTimeframe] = useState("last30days");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedPin, setSelectedPin] = useState("all");
  const [pins, setPins] = useState<any[]>([]);

  // Sample data for demonstration
  const sampleData = {
    impressions: {
      total: 24578,
      change: 12.5,
      daily: [
        { date: "2023-01-01", value: 520 },
        { date: "2023-01-02", value: 543 },
        { date: "2023-01-03", value: 587 },
        { date: "2023-01-04", value: 612 },
        { date: "2023-01-05", value: 632 },
        { date: "2023-01-06", value: 645 },
        { date: "2023-01-07", value: 689 },
        { date: "2023-01-08", value: 712 },
        { date: "2023-01-09", value: 735 },
        { date: "2023-01-10", value: 756 },
        { date: "2023-01-11", value: 798 },
        { date: "2023-01-12", value: 823 },
        { date: "2023-01-13", value: 856 },
        { date: "2023-01-14", value: 892 },
        { date: "2023-01-15", value: 923 },
        { date: "2023-01-16", value: 956 },
        { date: "2023-01-17", value: 987 },
        { date: "2023-01-18", value: 1023 },
        { date: "2023-01-19", value: 1056 },
        { date: "2023-01-20", value: 1089 },
        { date: "2023-01-21", value: 1123 },
        { date: "2023-01-22", value: 1156 },
        { date: "2023-01-23", value: 1189 },
        { date: "2023-01-24", value: 1223 },
        { date: "2023-01-25", value: 1256 },
        { date: "2023-01-26", value: 1289 },
        { date: "2023-01-27", value: 1323 },
        { date: "2023-01-28", value: 1356 },
        { date: "2023-01-29", value: 1389 },
        { date: "2023-01-30", value: 1423 },
      ]
    },
    engagements: {
      total: 3245,
      change: 8.7,
      daily: [
        { date: "2023-01-01", value: 78 },
        { date: "2023-01-02", value: 82 },
        { date: "2023-01-03", value: 87 },
        { date: "2023-01-04", value: 92 },
        { date: "2023-01-05", value: 97 },
        { date: "2023-01-06", value: 102 },
        { date: "2023-01-07", value: 106 },
        { date: "2023-01-08", value: 111 },
        { date: "2023-01-09", value: 116 },
        { date: "2023-01-10", value: 119 },
        { date: "2023-01-11", value: 122 },
        { date: "2023-01-12", value: 126 },
        { date: "2023-01-13", value: 129 },
        { date: "2023-01-14", value: 133 },
        { date: "2023-01-15", value: 135 },
        { date: "2023-01-16", value: 138 },
        { date: "2023-01-17", value: 141 },
        { date: "2023-01-18", value: 143 },
        { date: "2023-01-19", value: 145 },
        { date: "2023-01-20", value: 148 },
        { date: "2023-01-21", value: 150 },
        { date: "2023-01-22", value: 152 },
        { date: "2023-01-23", value: 154 },
        { date: "2023-01-24", value: 156 },
        { date: "2023-01-25", value: 158 },
        { date: "2023-01-26", value: 160 },
        { date: "2023-01-27", value: 162 },
        { date: "2023-01-28", value: 164 },
        { date: "2023-01-29", value: 166 },
        { date: "2023-01-30", value: 168 },
      ]
    },
    clicks: {
      total: 1245,
      change: 15.2,
      daily: [
        { date: "2023-01-01", value: 28 },
        { date: "2023-01-02", value: 31 },
        { date: "2023-01-03", value: 33 },
        { date: "2023-01-04", value: 36 },
        { date: "2023-01-05", value: 39 },
        { date: "2023-01-06", value: 41 },
        { date: "2023-01-07", value: 44 },
        { date: "2023-01-08", value: 46 },
        { date: "2023-01-09", value: 49 },
        { date: "2023-01-10", value: 51 },
        { date: "2023-01-11", value: 54 },
        { date: "2023-01-12", value: 56 },
        { date: "2023-01-13", value: 59 },
        { date: "2023-01-14", value: 61 },
        { date: "2023-01-15", value: 64 },
        { date: "2023-01-16", value: 66 },
        { date: "2023-01-17", value: 69 },
        { date: "2023-01-18", value: 71 },
        { date: "2023-01-19", value: 74 },
        { date: "2023-01-20", value: 76 },
        { date: "2023-01-21", value: 79 },
        { date: "2023-01-22", value: 81 },
        { date: "2023-01-23", value: 84 },
        { date: "2023-01-24", value: 86 },
        { date: "2023-01-25", value: 89 },
        { date: "2023-01-26", value: 91 },
        { date: "2023-01-27", value: 94 },
        { date: "2023-01-28", value: 96 },
        { date: "2023-01-29", value: 99 },
        { date: "2023-01-30", value: 101 },
      ]
    },
    saves: {
      total: 876,
      change: 9.8,
      daily: [
        { date: "2023-01-01", value: 22 },
        { date: "2023-01-02", value: 24 },
        { date: "2023-01-03", value: 25 },
        { date: "2023-01-04", value: 27 },
        { date: "2023-01-05", value: 28 },
        { date: "2023-01-06", value: 30 },
        { date: "2023-01-07", value: 31 },
        { date: "2023-01-08", value: 33 },
        { date: "2023-01-09", value: 34 },
        { date: "2023-01-10", value: 36 },
        { date: "2023-01-11", value: 37 },
        { date: "2023-01-12", value: 39 },
        { date: "2023-01-13", value: 40 },
        { date: "2023-01-14", value: 42 },
        { date: "2023-01-15", value: 43 },
        { date: "2023-01-16", value: 45 },
        { date: "2023-01-17", value: 46 },
        { date: "2023-01-18", value: 48 },
        { date: "2023-01-19", value: 49 },
        { date: "2023-01-20", value: 51 },
        { date: "2023-01-21", value: 52 },
        { date: "2023-01-22", value: 54 },
        { date: "2023-01-23", value: 55 },
        { date: "2023-01-24", value: 57 },
        { date: "2023-01-25", value: 58 },
        { date: "2023-01-26", value: 60 },
        { date: "2023-01-27", value: 61 },
        { date: "2023-01-28", value: 63 },
        { date: "2023-01-29", value: 64 },
        { date: "2023-01-30", value: 66 },
      ]
    },
    demographics: {
      gender: [
        { name: "Female", value: 68 },
        { name: "Male", value: 29 },
        { name: "Other", value: 3 }
      ],
      age: [
        { name: "18-24", value: 22 },
        { name: "25-34", value: 35 },
        { name: "35-44", value: 24 },
        { name: "45-54", value: 12 },
        { name: "55+", value: 7 }
      ],
      device: [
        { name: "Mobile", value: 75 },
        { name: "Desktop", value: 23 },
        { name: "Tablet", value: 2 }
      ],
      location: [
        { name: "United States", value: 45 },
        { name: "United Kingdom", value: 12 },
        { name: "Canada", value: 8 },
        { name: "Australia", value: 7 },
        { name: "Germany", value: 5 },
        { name: "France", value: 4 },
        { name: "Other", value: 19 }
      ]
    },
    topPins: [
      { id: "pin1", title: "10 Tips for Better Pins", impressions: 5432, saves: 234, clicks: 345 },
      { id: "pin2", title: "Ultimate Pinterest Guide", impressions: 4356, saves: 189, clicks: 278 },
      { id: "pin3", title: "How to Grow Your Account", impressions: 3245, saves: 156, clicks: 201 },
      { id: "pin4", title: "Pinterest SEO Strategies", impressions: 2987, saves: 143, clicks: 187 },
      { id: "pin5", title: "Best Times to Post", impressions: 2456, saves: 121, clicks: 154 },
    ]
  };

  // Check if user has connected Pinterest account
  useEffect(() => {
    const checkPinterestConnection = async () => {
      if (!user?.id) return;

      try {
        const credentials = await getPinterestCredentials(user.id);
        setPinterestConnected(!!credentials?.access_token);
      } catch (err) {
        console.error("Error checking Pinterest connection:", err);
        setPinterestConnected(false);
      }
    };

    checkPinterestConnection();
  }, [user]);

  // Load analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);

      // In a real application, you would fetch analytics data from the Pinterest API
      // For this demo, we'll use sample data

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalyticsData(sampleData);
      setLoading(false);
    };

    fetchAnalyticsData();
  }, [timeframe, startDate, endDate, selectedPin]);

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);

    switch (value) {
      case "last7days":
        setStartDate(subDays(new Date(), 7));
        setEndDate(new Date());
        break;
      case "last30days":
        setStartDate(subDays(new Date(), 30));
        setEndDate(new Date());
        break;
      case "last90days":
        setStartDate(subDays(new Date(), 90));
        setEndDate(new Date());
        break;
      case "lastYear":
        setStartDate(subMonths(new Date(), 12));
        setEndDate(new Date());
        break;
      // Custom range is handled by the date picker
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your Pinterest performance and analyze audience engagement
        </p>
      </div>

      {!pinterestConnected ? (
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle>Connect Your Pinterest Account</CardTitle>
            <CardDescription>
              You need to connect your Pinterest account to access analytics
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Select 
                value={timeframe} 
                onValueChange={handleTimeframeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="lastYear">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeframe === "custom" && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {format(startDate, "PPP")}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span>to</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {format(endDate, "PPP")}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Select 
                value={selectedPin} 
                onValueChange={setSelectedPin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All pins</SelectItem>
                  {pins.map(pin => (
                    <SelectItem key={pin.id} value={pin.id}>
                      {pin.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={exportAnalytics}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Pin Performance</TabsTrigger>
              <TabsTrigger value="audience">Audience Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-black border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{analyticsData.impressions?.total.toLocaleString()}</div>
                    <p className={`text-xs ${analyticsData.impressions?.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analyticsData.impressions?.change > 0 ? '+' : ''}{analyticsData.impressions?.change}% from previous period
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Engagements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{analyticsData.engagements?.total.toLocaleString()}</div>
                    <p className={`text-xs ${analyticsData.engagements?.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analyticsData.engagements?.change > 0 ? '+' : ''}{analyticsData.engagements?.change}% from previous period
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{analyticsData.clicks?.total.toLocaleString()}</div>
                    <p className={`text-xs ${analyticsData.clicks?.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analyticsData.clicks?.change > 0 ? '+' : ''}{analyticsData.clicks?.change}% from previous period
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Saves</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{analyticsData.saves?.total.toLocaleString()}</div>
                    <p className={`text-xs ${analyticsData.saves?.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analyticsData.saves?.change > 0 ? '+' : ''}{analyticsData.saves?.change}% from previous period
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>
                      Track your pin performance metrics over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <LineChart
                        data={[
                          {
                            name: "Impressions",
                            data: formatChartData(analyticsData.impressions?.daily)
                          },
                          {
                            name: "Engagements",
                            data: formatChartData(analyticsData.engagements?.daily)
                          },
                          {
                            name: "Clicks",
                            data: formatChartData(analyticsData.clicks?.daily)
                          },
                          {
                            name: "Saves",
                            data: formatChartData(analyticsData.saves?.daily)
                          }
                        ]}
                        yAxisWidth={60}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Top Performing Pins</CardTitle>
                    <CardDescription>
                      Your most successful pins based on overall engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPins?.map((pin: any, index: number) => (
                        <div key={pin.id} className="flex items-center gap-4">
                          <div className="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{pin.title}</h4>
                            <div className="flex gap-3 text-xs text-gray-400 mt-1">
                              <span>{pin.impressions.toLocaleString()} impressions</span>
                              <span>{pin.saves.toLocaleString()} saves</span>
                              <span>{pin.clicks.toLocaleString()} clicks</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                    <CardDescription>
                      Understand who is engaging with your content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <DonutChart
                        data={analyticsData.demographics?.gender.map((item: any) => ({
                          name: item.name,
                          value: item.value
                        }))}
                        label="Audience"
                        labelClassName="text-sm font-medium"
                        valueClassName="text-xl font-bold"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Impressions</CardTitle>
                    <CardDescription>
                      Daily impressions over the selected time period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <AreaChart
                        data={[
                          {
                            name: "Impressions",
                            data: formatChartData(analyticsData.impressions?.daily)
                          }
                        ]}
                        yAxisWidth={60}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Engagement Rate</CardTitle>
                    <CardDescription>
                      Combined engagement metrics (saves, clicks, comments)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <LineChart
                        data={[
                          {
                            name: "Engagements",
                            data: formatChartData(analyticsData.engagements?.daily)
                          }
                        ]}
                        yAxisWidth={60}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Clicks vs Saves</CardTitle>
                    <CardDescription>
                      Comparison of click-through rate and save rate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <BarChart
                        data={[
                          {
                            name: "Clicks",
                            data: formatChartData(analyticsData.clicks?.daily)
                          },
                          {
                            name: "Saves",
                            data: formatChartData(analyticsData.saves?.daily)
                          }
                        ]}
                        yAxisWidth={60}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audience">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Audience by Gender</CardTitle>
                    <CardDescription>
                      Distribution of your audience by gender
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <DonutChart
                        data={analyticsData.demographics?.gender.map((item: any) => ({
                          name: item.name,
                          value: item.value
                        }))}
                        label="Gender"
                        labelClassName="text-sm font-medium"
                        valueClassName="text-xl font-bold"
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Audience by Age</CardTitle>
                    <CardDescription>
                      Distribution of your audience by age group
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <BarChart
                        data={[
                          {
                            name: "Age Distribution",
                            data: analyticsData.demographics?.age.map((item: any) => ({
                              x: item.name,
                              y: item.value
                            }))
                          }
                        ]}
                        yAxisWidth={60}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Audience by Device</CardTitle>
                    <CardDescription>
                      Distribution of your audience by device type
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {!loading && (
                      <DonutChart
                        data={analyticsData.demographics?.device.map((item: any) => ({
                          name: item.name,
                          value: item.value
                        }))}
                        label="Devices"
                        labelClassName="text-sm font-medium"
                        valueClassName="text-xl font-bold"
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Top Locations</CardTitle>
                    <CardDescription>
                      Geographic distribution of your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.demographics?.location.map((item: any) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                          </div>
                          <div className="w-32 bg-gray-800 rounded-full h-2">
                            <div
                              className="bg
