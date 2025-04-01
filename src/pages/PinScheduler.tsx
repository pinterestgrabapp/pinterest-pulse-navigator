import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon, Check, Clock, Edit, ExternalLink, ImagePlus, Loader2, MoreHorizontal, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, addDays, isAfter } from "date-fns";
import { Link } from "react-router-dom";
import { fetchUserBoards } from "@/utils/chartUtils";
import { CardFooter } from "@/components/ui/card-footer";
import { triggerClick } from "@/utils/domUtils";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
  boardId: z.string().min(1, { message: "Please select a board" }),
  scheduledDate: z.date(),
  scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time in 24-hour format (HH:MM)" }),
});

type FormValues = z.infer<typeof formSchema>;

const PinScheduler = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [boards, setBoards] = useState<any[]>([]);
  const [scheduledPins, setScheduledPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [pinterestConnected, setPinterestConnected] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      boardId: "",
      scheduledDate: new Date(),
      scheduledTime: "12:00",
    },
  });

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
        
        if (data && data.access_token) {
          setPinterestConnected(true);
          fetchPinterestBoards(data.access_token);
        } else {
          setPinterestConnected(false);
        }
      } catch (err) {
        console.error("Error checking Pinterest connection:", err);
        setPinterestConnected(false);
      }
    };
    
    checkPinterestConnection();
  }, [user]);
  
  const fetchPinterestBoards = async (accessToken: string) => {
    setLoadingBoards(true);
    try {
      const boardsData = await fetchUserBoards(accessToken);
      if (boardsData) {
        const boardsList = Array.isArray(boardsData) ? boardsData : 
                          (boardsData.items ? boardsData.items : 
                          (boardsData.data ? boardsData.data : []));
        setBoards(boardsList);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
      toast.error("Failed to fetch Pinterest boards", {
        description: "Please try refreshing the page or reconnect your Pinterest account"
      });
    } finally {
      setLoadingBoards(false);
    }
  };
  
  useEffect(() => {
    const fetchScheduledPins = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("scheduled_pins")
          .select("*")
          .eq("user_id", user.id)
          .order("scheduled_time", { ascending: true });
          
        if (error) {
          console.error("Error fetching scheduled pins:", error);
          return;
        }
        
        setScheduledPins(data || []);
      } catch (err) {
        console.error("Error fetching scheduled pins:", err);
      }
    };
    
    fetchScheduledPins();
  }, [user]);
  
  const onSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to schedule pins");
      return;
    }
    
    if (!pinterestConnected) {
      toast.error("Pinterest account not connected", {
        description: "Please connect your Pinterest account in Settings to schedule pins"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const scheduledDateTime = new Date(values.scheduledDate);
      const [hours, minutes] = values.scheduledTime.split(":").map(Number);
      scheduledDateTime.setHours(hours, minutes);
      
      const { data, error } = await supabase
        .from("scheduled_pins")
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description || null,
          image_url: values.imageUrl,
          board_id: values.boardId,
          scheduled_time: scheduledDateTime.toISOString(),
          status: "scheduled"
        })
        .select();
        
      if (error) {
        console.error("Error scheduling pin:", error);
        toast.error("Failed to schedule pin", {
          description: error.message
        });
        return;
      }
      
      toast.success("Pin scheduled successfully", {
        description: `Your pin will be posted on ${format(scheduledDateTime, "PPP 'at' p")}`
      });
      
      if (data && data[0]) {
        setScheduledPins([...scheduledPins, data[0]]);
      }
      
      form.reset({
        title: "",
        description: "",
        imageUrl: "",
        boardId: values.boardId,
        scheduledDate: new Date(),
        scheduledTime: "12:00",
      });
    } catch (err) {
      console.error("Error scheduling pin:", err);
      toast.error("Failed to schedule pin", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteScheduledPin = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("scheduled_pins")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error deleting scheduled pin:", error);
        toast.error("Failed to delete scheduled pin", {
          description: error.message
        });
        return;
      }
      
      setScheduledPins(scheduledPins.filter(pin => pin.id !== id));
      
      toast.success("Scheduled pin deleted", {
        description: "The pin has been removed from your schedule"
      });
    } catch (err) {
      console.error("Error deleting scheduled pin:", err);
      toast.error("Failed to delete scheduled pin", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  const handleSelectFile = () => {
    const fileInput = document.querySelector('#pin-image-upload');
    if (fileInput) {
      triggerClick(fileInput);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pin Scheduler</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Schedule your pins to be posted automatically at specific times to maximize engagement
        </p>
      </div>
      
      {!pinterestConnected ? (
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle>Connect Your Pinterest Account</CardTitle>
            <CardDescription>
              You need to connect your Pinterest account to schedule pins
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/settings">Go to Settings</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="schedule">Schedule New Pin</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Pins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Create New Scheduled Pin</CardTitle>
                <CardDescription>
                  Fill out the form below to schedule a new pin to be posted automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter pin title" {...field} />
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
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter pin description (optional)" 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="boardId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pinterest Board</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a board" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {loadingBoards ? (
                                    <SelectItem value="loading" disabled>Loading boards...</SelectItem>
                                  ) : boards.length > 0 ? (
                                    boards.map((board) => (
                                      <SelectItem key={board.id} value={board.id}>
                                        {board.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled>No boards found</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="scheduledDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Schedule Date</FormLabel>
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
                                    disabled={(date) => date < new Date()}
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
                          name="scheduledTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Schedule Time (24h format)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="14:30" {...field} />
                                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Scheduling..." : "Schedule Pin"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card className="bg-black border-gray-800">
              <CardHeader>
                <CardTitle>Upcoming Scheduled Pins</CardTitle>
                <CardDescription>
                  View and manage your scheduled pins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledPins.length > 0 ? (
                  <div className="space-y-4">
                    {scheduledPins.map((pin) => (
                      <Card key={pin.id} className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/4">
                              <img 
                                src={pin.image_url} 
                                alt={pin.title} 
                                className="w-full h-40 object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{pin.title}</h3>
                              {pin.description && (
                                <p className="text-gray-400 text-sm mb-4">{pin.description}</p>
                              )}
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center">
                                  <CalendarIcon className="mr-1 h-3 w-3" />
                                  {format(new Date(pin.scheduled_time), "PPP 'at' p")}
                                </span>
                                <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center">
                                  {pin.status === "scheduled" ? (
                                    <Clock className="mr-1 h-3 w-3" />
                                  ) : (
                                    <Check className="mr-1 h-3 w-3" />
                                  )}
                                  {pin.status}
                                </span>
                              </div>
                            </div>
                            <div>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => deleteScheduledPin(pin.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No scheduled pins</h3>
                    <p className="text-gray-400 mb-4">
                      You haven't scheduled any pins yet. Start by creating a new scheduled pin.
                    </p>
                    <Button onClick={() => document.querySelector('[data-value="schedule"]')?.click()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule a Pin
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default PinScheduler;
