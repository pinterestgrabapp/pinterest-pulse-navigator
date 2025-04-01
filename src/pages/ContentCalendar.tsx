
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon, Clock, Edit3, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  eventType: z.enum(["pin", "campaign", "holiday", "custom"]),
  eventDate: z.date(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Invalid color format" }),
  pinId: z.string().optional(),
  campaignId: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const ContentCalendar = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEvents, setFetchingEvents] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [pins, setPins] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "custom",
      eventDate: new Date(),
      color: "#ea384c", // Pinterest red color
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (!eventDialogOpen) {
      // If dialog is closed, reset the form
      form.reset({
        title: "",
        description: "",
        eventType: "custom",
        eventDate: selectedDate,
        color: "#ea384c",
      });
      setIsEditMode(false);
      setSelectedEvent(null);
    }
  }, [eventDialogOpen, selectedDate, form]);
  
  // Set form values when editing an event
  useEffect(() => {
    if (selectedEvent && isEditMode) {
      form.reset({
        title: selectedEvent.title,
        description: selectedEvent.description || "",
        eventType: selectedEvent.event_type,
        eventDate: parseISO(selectedEvent.event_date),
        color: selectedEvent.color || "#ea384c",
        pinId: selectedEvent.pin_id || undefined,
        campaignId: selectedEvent.campaign_id || undefined,
      });
    }
  }, [selectedEvent, isEditMode, form]);
  
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) return;
      
      setFetchingEvents(true);
      try {
        const { data, error } = await supabase
          .from("content_calendar")
          .select("*")
          .eq("user_id", user.id)
          .order("event_date", { ascending: true });
          
        if (error) {
          console.error("Error fetching events:", error);
          return;
        }
        
        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setFetchingEvents(false);
      }
    };
    
    fetchEvents();
  }, [user]);
  
  // Fetch pins
  useEffect(() => {
    const fetchPins = async () => {
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
    
    fetchPins();
  }, [user]);
  
  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user?.id) return;
      
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
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };
    
    fetchCampaigns();
  }, [user]);
  
  // Handle form submission
  const onSubmit = async (values: EventFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to create events");
      return;
    }
    
    setLoading(true);
    
    try {
      const eventData = {
        user_id: user.id,
        title: values.title,
        description: values.description || null,
        event_type: values.eventType,
        event_date: values.eventDate.toISOString(),
        color: values.color,
        pin_id: values.pinId || null,
        campaign_id: values.campaignId || null,
      };
      
      if (isEditMode && selectedEvent) {
        // Update existing event
        const { data, error } = await supabase
          .from("content_calendar")
          .update(eventData)
          .eq("id", selectedEvent.id)
          .eq("user_id", user.id)
          .select();
          
        if (error) {
          console.error("Error updating event:", error);
          toast.error("Failed to update event", {
            description: error.message
          });
          return;
        }
        
        toast.success("Event updated successfully");
        
        // Update events list
        if (data && data[0]) {
          setEvents(events.map(event => 
            event.id === selectedEvent.id ? data[0] : event
          ));
        }
      } else {
        // Create new event
        const { data, error } = await supabase
          .from("content_calendar")
          .insert(eventData)
          .select();
          
        if (error) {
          console.error("Error creating event:", error);
          toast.error("Failed to create event", {
            description: error.message
          });
          return;
        }
        
        toast.success("Event created successfully");
        
        // Add to events list
        if (data && data[0]) {
          setEvents([...events, data[0]]);
        }
      }
      
      setEventDialogOpen(false);
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error("Failed to save event", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete event
  const deleteEvent = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("content_calendar")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event", {
          description: error.message
        });
        return;
      }
      
      // Remove from events list
      setEvents(events.filter(event => event.id !== id));
      
      toast.success("Event deleted");
      
      // Close dialog if the deleted event was selected
      if (selectedEvent && selectedEvent.id === id) {
        setEventDialogOpen(false);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.event_date), date)
    );
  };
  
  // Calculate the number of events for a day (used in calendar rendering)
  const getDayEventCount = (date: Date) => {
    const count = getEventsForDay(date).length;
    return count > 0 ? count : undefined;
  };
  
  // Render the events for the selected day
  const renderDayEvents = () => {
    const dayEvents = getEventsForDay(selectedDate);
    
    if (dayEvents.length === 0) {
      return (
        <div className="text-center py-6">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No events on this day</h3>
          <p className="text-gray-400 mb-4">
            There are no events scheduled for {format(selectedDate, "MMMM d, yyyy")}
          </p>
          <Button onClick={() => setEventDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {dayEvents.map(event => (
          <Card key={event.id} className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                    style={{ backgroundColor: event.color || "#ea384c" }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-base">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <span className="capitalize mr-3">{event.event_type}</span>
                      <span>{format(parseISO(event.event_date), "h:mm a")}</span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-300 mt-2">{event.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsEditMode(true);
                      setEventDialogOpen(true);
                    }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Plan and organize your Pinterest content schedule
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Select a date to view or add events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                components={{
                  DayContainer: (props) => {
                    const eventCount = props.date ? getDayEventCount(props.date) : undefined;
                    return (
                      <div className="relative">
                        {props.children}
                        {eventCount && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-pinterest-red"></div>
                        )}
                      </div>
                    );
                  }
                }}
              />
              
              <div className="mt-4">
                <Button 
                  className="w-full"
                  onClick={() => setEventDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event for {format(selectedDate, "MMM d")}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black border-gray-800 mt-4">
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-pinterest-red mr-3"></div>
                  <span>Pin Publishing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <span>Ad Campaigns</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span>Holidays</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                  <span>Custom Events</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
              <CardDescription>
                Events scheduled for this day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchingEvents ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-800 rounded"></div>
                  <div className="h-20 bg-gray-800 rounded"></div>
                </div>
              ) : (
                renderDayEvents()
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Edit the details of your calendar event" 
                : `Create a new event for ${format(selectedDate, "MMMM d, yyyy")}`}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pin">Pin Publishing</SelectItem>
                        <SelectItem value="campaign">Ad Campaign</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="custom">Custom Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("eventType") === "pin" && (
                <FormField
                  control={form.control}
                  name="pinId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Pin</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pins.map(pin => (
                            <SelectItem key={pin.id} value={pin.id}>
                              {pin.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {form.watch("eventType") === "campaign" && (
                <FormField
                  control={form.control}
                  name="campaignId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Campaign</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaigns.map(campaign => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="color" 
                            {...field}
                            className="w-10 h-10 p-1 bg-transparent"
                          />
                          <Input 
                            type="text" 
                            {...field}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add event details" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="gap-2">
                {isEditMode && (
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={() => selectedEvent && deleteEvent(selectedEvent.id)}
                  >
                    Delete
                  </Button>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEditMode ? "Update Event" : "Add Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ContentCalendar;
