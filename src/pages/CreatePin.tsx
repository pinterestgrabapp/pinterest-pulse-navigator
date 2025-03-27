
import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Upload } from "lucide-react";
import { useLanguage } from "@/utils/languageUtils";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

const CreatePin = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image for your pin",
        variant: "destructive"
      });
      return;
    }
    
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your pin",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Store image in Supabase Storage
      const fileName = `${user?.id}_${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pins')
        .upload(fileName, imageFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pins')
        .getPublicUrl(fileName);
        
      const imageUrl = urlData.publicUrl;
      
      // Parse keywords into array
      const keywordsArray = keywords.split(',').map(k => k.trim());
      
      // Store pin data in database
      const { error: insertError } = await supabase
        .from('pins')
        .insert({
          user_id: user?.id,
          title,
          description,
          keywords: keywordsArray,
          link,
          image_url: imageUrl,
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Pin created successfully!",
        description: "Your pin has been created and is ready to view",
      });

      // Show toast notification
      toast.success("Pin created successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setKeywords("");
      setLink("");
      setImageFile(null);
      setImagePreview(null);
      
      // Navigate to saved pins
      setTimeout(() => {
        navigate('/saved-pins');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating pin:', error);
      toast({
        title: "Error creating pin",
        description: "There was a problem creating your pin. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Determine background styles based on theme
  const getBgStyle = () => {
    return {
      backgroundColor: theme === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
      borderColor: dragActive ? 'rgb(234, 56, 76)' : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    };
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('createPin')}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('createPinDescription')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-pinterest-red/5 backdrop-blur-sm rounded-lg"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl">{t('pinDetails')}</CardTitle>
              <CardDescription>{t('pinDetailsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="title">{t('pinTitle')}</Label>
                  <Input 
                    id="title" 
                    placeholder={t('pinTitlePlaceholder')} 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-white/10 focus-visible:ring-pinterest-red/70"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('pinDescription')}</Label>
                  <Textarea 
                    id="description" 
                    placeholder={t('pinDescriptionPlaceholder')} 
                    className="min-h-[120px] border-white/10 focus-visible:ring-pinterest-red/70"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="keywords">{t('pinKeywords')}</Label>
                  <Input 
                    id="keywords" 
                    placeholder={t('pinKeywordsPlaceholder')}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="border-white/10 focus-visible:ring-pinterest-red/70"
                  />
                  <p className="text-xs text-gray-500">{t('pinKeywordsHelp')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">{t('destinationLink')}</Label>
                  <Input 
                    id="link" 
                    placeholder="https://example.com/my-page" 
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="border-white/10 focus-visible:ring-pinterest-red/70"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-pinterest-red hover:bg-pinterest-dark text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                  disabled={isUploading}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff3366] to-[#ff0066] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                  <span className="relative z-10">
                    {isUploading ? 'Creating Pin...' : t('createPinButton')}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="glass-card border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-pinterest-red/5 backdrop-blur-sm rounded-lg"></div>
            <CardHeader className="relative z-10">
              <CardTitle>{t('pinImage')}</CardTitle>
              <CardDescription>{t('pinImageDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-col items-center justify-center">
                <div 
                  className={`w-full aspect-[2/3] rounded-lg mb-4 flex items-center justify-center border-2 border-dashed transition-all duration-300 overflow-hidden`}
                  style={getBgStyle()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Pin preview" 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImagePlus className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">{t('dragImageHere')}</p>
                      <p className="text-xs text-gray-400 mt-1">{t('recommendedSize')}</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-white/10 hover:bg-pinterest-red hover:text-white transition-all duration-300 group relative overflow-hidden"
                  onClick={triggerFileInput}
                  type="button"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff3366] to-[#ff0066] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {t('uploadImage')}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card mt-6 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-pinterest-red/5 backdrop-blur-sm rounded-lg"></div>
            <CardHeader className="relative z-10">
              <CardTitle>{t('pinPreview')}</CardTitle>
              <CardDescription>{t('pinPreviewDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div 
                className={`aspect-[2/3] rounded-lg mb-4 flex items-center justify-center border border-white/10 overflow-hidden`}
                style={{
                  backgroundColor: theme === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
                }}
              >
                {imagePreview ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={imagePreview} 
                      alt="Pin preview" 
                      className="w-full h-full object-contain" 
                    />
                    {title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold text-sm">{title}</h3>
                        {description && <p className="text-white/80 text-xs line-clamp-2 mt-1">{description}</p>}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">{t('previewWillAppearHere')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatePin;
