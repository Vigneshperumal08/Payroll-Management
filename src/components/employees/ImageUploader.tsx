
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Upload, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUploader = ({ onImageUpload, currentImage }: ImageUploaderProps) => {
  const [image, setImage] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image/')) {
      setUploadError('Please upload an image file');
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be smaller than 2MB');
      toast({
        title: "File too large",
        description: "Image must be smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // Simulate upload with FileReader for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
      onImageUpload(result);
      setIsUploading(false);
      
      toast({
        title: "Image uploaded",
        description: "Employee image has been updated successfully",
      });
    };
    
    reader.onerror = () => {
      setUploadError('Failed to read file');
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageUpload('');
    toast({
      title: "Image removed",
      description: "Employee image has been removed",
    });
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          {image ? (
            <div className="relative">
              <img 
                src={image} 
                alt="Employee" 
                className="h-24 w-24 rounded-full object-cover border-2 border-primary"
              />
              <button 
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                type="button"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="h-24 w-24 bg-muted flex items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50">
              {isUploading ? (
                <div className="animate-pulse text-primary">
                  <Check className="h-8 w-8" />
                </div>
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          )}
          
          {uploadError && (
            <p className="text-sm text-red-500">{uploadError}</p>
          )}

          <div className="mt-4">
            <Button 
              variant="outline" 
              type="button" 
              disabled={isUploading}
              className="relative"
              size="sm"
            >
              {image ? 'Change Image' : 'Upload Image'}
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleImageUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
