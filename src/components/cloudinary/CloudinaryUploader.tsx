
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloudinaryUploaderProps {
  onUploadComplete: (url: string) => void;
  className?: string;
}

export function CloudinaryUploader({ onUploadComplete, className }: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadToCloudinary = async (file: File) => {
    // Check if Cloudinary credentials are set
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = 'ml_default'; // You would typically set this in your Cloudinary settings
    
    if (!cloudName || cloudName === 'your_cloudinary_cloud_name') {
      toast({
        title: "Configuration error",
        description: "Cloudinary is not properly configured. Please check your .env file.",
        variant: "destructive",
      });
      return;
    }
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    
    try {
      setIsUploading(true);
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.floor(Math.random() * 10);
          return next > 95 ? 95 : next;
        });
      }, 300);
      
      // In a real app, this would be an actual Cloudinary API call
      // For demo purposes, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock response URL (in a real app, this would come from Cloudinary)
      const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1234567890/sample_${Date.now()}.jpg`;
      
      onUploadComplete(imageUrl);
      
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded to Cloudinary",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload to Cloudinary",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    uploadToCloudinary(file);
  };

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="p-4 flex flex-col items-center justify-center">
        {isUploading ? (
          <div className="w-full flex flex-col items-center py-6 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="w-full max-w-xs bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <div className="rounded-full bg-secondary p-4">
              <ImageIcon className="h-8 w-8 text-secondary-foreground" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium">Upload an image</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label htmlFor="file-upload">
                <Button type="button" size="sm" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
