import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  storagePath: string; // e.g., 'categories/abc123' or 'products/xyz789'
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onDelete?: () => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
  label?: string;
}

export default function ImageUpload({
  storagePath,
  currentImageUrl,
  onUploadComplete,
  onDelete,
  className,
  aspectRatio = 'video',
  label = 'Upload Image'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]'
  };

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPG, PNG, WebP)',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `${storagePath}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.error('Upload error:', error);
        setUploading(false);
        toast({
          title: 'Upload failed',
          description: error.message || 'Failed to upload image',
          variant: 'destructive'
        });
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadUrl);
          toast({
            title: 'Image uploaded',
            description: 'Your image has been uploaded successfully'
          });
        } catch (error: any) {
          console.error('Get URL error:', error);
          toast({
            title: 'Error',
            description: 'Failed to get image URL',
            variant: 'destructive'
          });
        } finally {
          setUploading(false);
          setProgress(0);
        }
      }
    );
  }, [storagePath, onUploadComplete, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDeleteImage = async () => {
    if (!currentImageUrl || !onDelete) return;

    try {
      // Extract the path from the URL to delete from storage
      const urlPath = decodeURIComponent(currentImageUrl.split('/o/')[1]?.split('?')[0]);
      if (urlPath) {
        const imageRef = ref(storage, urlPath);
        await deleteObject(imageRef);
      }
      onDelete();
      toast({
        title: 'Image deleted',
        description: 'The image has been removed'
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      // Still call onDelete even if storage deletion fails (image might not exist)
      onDelete();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg overflow-hidden transition-colors',
          aspectClasses[aspectRatio],
          dragOver ? 'border-primary bg-primary/5' : 'border-border',
          !currentImageUrl && !uploading && 'hover:border-primary/50 cursor-pointer'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleDeleteImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <Progress value={progress} className="w-full max-w-xs h-2" />
            <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </div>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 mb-2" />
              <span className="text-sm font-medium">Drop image here or click to upload</span>
              <span className="text-xs mt-1">JPG, PNG, WebP up to 5MB</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </div>

      {currentImageUrl && !uploading && (
        <label className="inline-block">
          <Button type="button" variant="outline" size="sm" asChild>
            <span className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Replace Image
            </span>
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}
    </div>
  );
}
