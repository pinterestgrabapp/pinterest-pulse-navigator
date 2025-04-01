import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Download, ImageIcon, Layers, Plus, Save, Share2, Square, Trash, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { ArrowRight, Trash2, Paintbrush } from "lucide-react";
import { triggerClick } from "@/utils/domUtils";

const templateFormSchema = z.object({
  name: z.string().min(3, { message: "Template name must be at least 3 characters" }),
  backgroundUrl: z.string().url({ message: "Please enter a valid background URL" }).optional(),
  templateType: z.enum(["standard", "carousel", "video", "idea"]),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

const TemplateDesigner = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [designElements, setDesignElements] = useState<any[]>([]);
  const [canvasBackground, setCanvasBackground] = useState("#f5f5f5");
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(900);
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [boldText, setBoldText] = useState(false);
  const [centerText, setCenterText] = useState(true);
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      backgroundUrl: "",
      templateType: "standard",
    },
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("pin_templates")
          .select("*")
          .or(`user_id.eq.${user.id},is_public.eq.true`)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching templates:", error);
          return;
        }
        
        setTemplates(data || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };
    
    fetchTemplates();
  }, [user]);
  
  const onSubmit = async (values: TemplateFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to create templates");
      return;
    }
    
    setLoading(true);
    
    try {
      const templateData = {
        background: values.backgroundUrl || canvasBackground,
        width: canvasWidth,
        height: canvasHeight,
        elements: designElements,
        textOptions: {
          color: textColor,
          size: fontSize,
          bold: boldText,
          centered: centerText,
        },
        templateType: values.templateType,
      };
      
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.fillStyle = canvasBackground;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.fillStyle = textColor;
        ctx.font = `${boldText ? 'bold' : 'normal'} ${fontSize}px Arial`;
        ctx.textAlign = centerText ? 'center' : 'left';
        ctx.fillText("Template Preview", canvasWidth / 2, canvasHeight / 2);
      }
      
      const imageUrl = canvas.toDataURL("image/png");
      
      const { data, error } = await supabase
        .from("pin_templates")
        .insert({
          user_id: user.id,
          name: values.name,
          image_url: imageUrl,
          template_data: templateData,
          is_public: false,
        })
        .select();
        
      if (error) {
        console.error("Error creating template:", error);
        toast.error("Failed to create template", {
          description: error.message
        });
        return;
      }
      
      toast.success("Template created successfully", {
        description: "Your new template is ready to use"
      });
      
      if (data && data[0]) {
        setTemplates([data[0], ...templates]);
      }
      
      form.reset({
        name: "",
        backgroundUrl: "",
        templateType: "standard",
      });
      
      setDesignElements([]);
    } catch (err) {
      console.error("Error creating template:", err);
      toast.error("Failed to create template", {
        description: "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTemplate = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from("pin_templates")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error deleting template:", error);
        toast.error("Failed to delete template", {
          description: error.message
        });
        return;
      }
      
      setTemplates(templates.filter(template => template.id !== id));
      
      toast.success("Template deleted", {
        description: "The template has been removed"
      });
    } catch (err) {
      console.error("Error deleting template:", err);
      toast.error("Failed to delete template", {
        description: "An unexpected error occurred"
      });
    }
  };
  
  const addTextElement = () => {
    setDesignElements([
      ...designElements,
      {
        type: "text",
        content: "Add your text here",
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        fontSize,
        color: textColor,
        bold: boldText,
        centered: centerText,
      }
    ]);
  };
  
  const useTemplate = (template: any) => {
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    
    toast.success("Template selected", {
      description: "Navigate to Create Pin to use this template"
    });
    
    window.location.href = "/create-pin";
  };
  
  const handleTemplateImageUpload = () => {
    // Explicitly cast to HTMLInputElement to ensure TypeScript knows it has a click method
    const fileInput = document.querySelector('#template-image-upload') as HTMLInputElement | null;
    triggerClick(fileInput);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Template Designer</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create custom Pinterest pin templates to enhance your visual content
        </p>
      </div>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Template</TabsTrigger>
          <TabsTrigger value="library">Template Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle>Design New Template</CardTitle>
              <CardDescription>
                Create a custom template for your Pinterest pins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Awesome Template" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="backgroundUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="templateType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select template type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard Pin</SelectItem>
                                <SelectItem value="carousel">Carousel Pin</SelectItem>
                                <SelectItem value="video">Video Pin</SelectItem>
                                <SelectItem value="idea">Idea Pin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Background Color</label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color" 
                              value={canvasBackground} 
                              onChange={(e) => setCanvasBackground(e.target.value)}
                              className="w-10 h-10 p-1 bg-transparent"
                            />
                            <Input 
                              type="text" 
                              value={canvasBackground} 
                              onChange={(e) => setCanvasBackground(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Canvas Size</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Width: {canvasWidth}px</span>
                              <Slider 
                                defaultValue={[canvasWidth]} 
                                min={300} 
                                max={1200} 
                                step={50} 
                                onValueChange={(values) => setCanvasWidth(values[0])}
                              />
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Height: {canvasHeight}px</span>
                              <Slider 
                                defaultValue={[canvasHeight]} 
                                min={300} 
                                max={1800} 
                                step={50} 
                                onValueChange={(values) => setCanvasHeight(values[0])}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Text Settings</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Input 
                                type="color" 
                                value={textColor} 
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-10 h-10 p-1 bg-transparent"
                              />
                              <Input 
                                type="text" 
                                value={textColor} 
                                onChange={(e) => setTextColor(e.target.value)}
                                placeholder="Text color"
                              />
                            </div>
                            
                            <div>
                              <span className="text-xs text-gray-500 mb-1 block">Font Size: {fontSize}px</span>
                              <Slider 
                                defaultValue={[fontSize]} 
                                min={12} 
                                max={72} 
                                step={1} 
                                onValueChange={(values) => setFontSize(values[0])}
                              />
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="bold-text"
                                  checked={boldText}
                                  onCheckedChange={setBoldText}
                                />
                                <label htmlFor="bold-text" className="text-sm cursor-pointer">
                                  Bold
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="center-text"
                                  checked={centerText}
                                  onCheckedChange={setCenterText}
                                />
                                <label htmlFor="center-text" className="text-sm cursor-pointer">
                                  Center Align
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <Button type="button" variant="outline" onClick={addTextElement}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Text Element
                        </Button>
                        
                        <Button type="submit" disabled={loading}>
                          {loading ? "Creating..." : "Save Template"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="border border-gray-700 rounded-lg p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium mb-3">Canvas Preview</h3>
                    <div 
                      className="flex-1 flex items-center justify-center p-4 overflow-auto"
                      style={{ 
                        backgroundColor: "#2a2a2a", 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233a3a3a' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` 
                      }}
                    >
                      <div 
                        style={{ 
                          width: canvasWidth,
                          height: canvasHeight,
                          backgroundColor: canvasBackground,
                          backgroundImage: form.watch("backgroundUrl") ? `url(${form.watch("backgroundUrl")})` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
                        }}
                        className="relative"
                      >
                        {designElements.map((element, index) => (
                          <div 
                            key={index} 
                            style={{
                              position: "absolute",
                              left: element.centered ? "50%" : element.x,
                              top: element.y,
                              transform: element.centered ? "translateX(-50%)" : "none",
                              color: element.color,
                              fontSize: `${element.fontSize}px`,
                              fontWeight: element.bold ? "bold" : "normal",
                              textAlign: element.centered ? "center" : "left",
                              cursor: "move",
                              padding: "5px",
                              border: "1px dashed rgba(255, 255, 255, 0.3)",
                              borderRadius: "4px",
                            }}
                          >
                            {element.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="library">
          <Card className="bg-black border-gray-800">
            <CardHeader>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>
                Browse and manage your Pinterest pin templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="bg-gray-900 border-gray-700 overflow-hidden">
                      <div className="aspect-[2/3] overflow-hidden">
                        <img 
                          src={template.image_url} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-xs text-gray-400 mb-3">
                          {template.is_public ? "Public Template" : "Your Template"}
                        </p>
                        <div className="flex justify-between">
                          <Button 
                            size="sm" 
                            onClick={() => useTemplate(template)}
                            className="flex-1 mr-2"
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Use
                          </Button>
                          
                          {template.user_id === user?.id && (
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => deleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Paintbrush className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No templates found</h3>
                  <p className="text-gray-400 mb-4">
                    You haven't created any templates yet. Start by creating a new template.
                  </p>
                  <Button onClick={() => document.querySelector('[data-value="create"]')?.click()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TemplateDesigner;
