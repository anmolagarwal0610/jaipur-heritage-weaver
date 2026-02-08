import { useState, useCallback, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

interface MultiImageUploadProps {
  storagePath: string;
  onUploadComplete: (url: string) => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export default function MultiImageUpload({
  storagePath,
  onUploadComplete,
  className,
  aspectRatio = 'square'
}: MultiImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]'
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: `${file.name} is not an image`, variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: `${file.name} exceeds 5MB`, variant: 'destructive' });
      return;
    }

    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `${storagePath}/${fileName}`);

    setUploadingFiles(prev => [...prev, { id: fileId, name: file.name, progress: 0, status: 'uploading' }]);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: prog } : f));
      },
      (error) => {
        console.error('Upload error:', error);
        setUploadingFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f));
        toast({ title: 'Upload failed', description: `Failed to upload ${file.name}`, variant: 'destructive' });
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
        }, 3000);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadUrl);
          setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (error) {
          console.error('Get URL error:', error);
          setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
          toast({ title: 'Error', description: 'Failed to get image URL', variant: 'destructive' });
        }
      }
    );
  }, [storagePath, onUploadComplete, toast]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => uploadFile(file));
  }, [uploadFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const isUploading = uploadingFiles.length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg overflow-hidden transition-colors',
          aspectClasses[aspectRatio],
          dragOver ? 'border-primary bg-primary/5' : 'border-border',
          !isUploading && 'hover:border-primary/50 cursor-pointer'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div className="w-full max-w-xs space-y-2">
              {uploadingFiles.map(f => (
                <div key={f.id} className="space-y-1">
                  <p className="text-xs text-muted-foreground truncate">{f.name}</p>
                  <Progress value={f.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-xs font-medium">Drop images or click to upload</span>
              <span className="text-[10px] mt-1">Multiple files supported • Max 5MB each</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </div>
    </div>
  );
}
