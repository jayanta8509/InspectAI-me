
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle, X, Upload, Camera, RefreshCw } from 'lucide-react';
import type { ReportImage, ImageValue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AudioRecorder } from './audio-recorder';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value: ReportImage[];
  onValueChange: (value: ReportImage[]) => void;
  disabled?: boolean;
}

function isDataUrl(str: string): str is `data:image/${string}` {
    return str.startsWith('data:image/');
}

export function ImageUploader({ value, onValueChange, disabled }: ImageUploaderProps) {
  const [open, setOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getDisplayImage = (imageSrc: ImageValue) => {
    if (isDataUrl(imageSrc)) {
      return {
        id: imageSrc,
        imageUrl: imageSrc,
        description: 'A newly added image',
        imageHint: 'custom image',
      };
    }
    return null;
  };
  
  useEffect(() => {
    const stopCamera = () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };

    if (!isCameraOpen) {
      stopCamera();
    }
    
    return stopCamera;
  }, [isCameraOpen]);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const newImages: ReportImage[] = [];
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as ImageValue;
                newImages.push({ src: dataUrl, comment: '' });
                if (newImages.length === files.length) {
                    onValueChange([...value, ...newImages]);
                     toast({
                        title: `${files.length} Image(s) Added`,
                        description: 'The image(s) have been added to the report (this session only).',
                    });
                }
            };
            reader.readAsDataURL(file);
        })
        setOpen(false);
    }
  };

  const startVideoStream = async (deviceId?: string) => {
     if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { deviceId: deviceId ? { exact: deviceId } : undefined }
      });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };
  
  const openCamera = async () => {
    setIsCameraOpen(true);
    setOpen(false);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Stop initial stream immediately

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
        let initialDeviceId = videoDevices[0]?.deviceId;
        // Prioritize rear camera ('environment')
        const rearCamera = videoDevices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
        if (rearCamera) {
          initialDeviceId = rearCamera.deviceId;
        }

        setSelectedDeviceId(initialDeviceId);
        await startVideoStream(initialDeviceId);

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    } else {
      setHasCameraPermission(false);
    }
  };

  const flipCamera = () => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(d => d.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      const nextDeviceId = devices[nextIndex].deviceId;
      setSelectedDeviceId(nextDeviceId);
      startVideoStream(nextDeviceId);
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/png') as ImageValue;
      
      onValueChange([...value, {src: dataUri, comment: ''}]);
      
      toast({
        title: 'Picture Added',
        description: 'The picture has been added to the report (this session only).',
      });
      
      setIsCameraOpen(false);
    }
  };
  
  const removeImage = (index: number) => {
    onValueChange(value.filter((_, i) => i !== index));
  };
  
  const handleCommentChange = (index: number, comment: string) => {
    const newValue = [...value];
    newValue[index].comment = comment;
    onValueChange(newValue);
  };

  const addImageButton = (
    <DialogTrigger asChild>
      <button
        type="button"
        disabled={disabled}
        className="flex flex-col items-center justify-center w-full h-full rounded-md border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:bg-muted/50 hover:border-primary hover:text-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PlusCircle className="h-8 w-8" />
        <span className="text-xs mt-1">Add Image</span>
      </button>
    </DialogTrigger>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {value.map((reportImage, index) => {
          const displayImage = getDisplayImage(reportImage.src);
          return (
            displayImage && (
              <div key={index} className="relative group space-y-2">
                <button
                    type="button"
                    className="aspect-square w-full relative bg-muted/20 rounded-md block"
                    onClick={() => setSelectedImage(displayImage.imageUrl)}
                    disabled={disabled}
                >
                    <Image
                      src={displayImage.imageUrl}
                      alt={displayImage.description}
                      fill
                      className="rounded-md object-contain"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      data-ai-hint={displayImage.imageHint}
                    />
                    {!disabled && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    )}
                </button>
                 <div className="relative">
                  <Label htmlFor={`img-comment-${index}`} className="sr-only">Image Comment</Label>
                  <Textarea
                    id={`img-comment-${index}`}
                    placeholder="Add a comment..."
                    value={reportImage.comment}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    disabled={disabled}
                    className="text-xs h-16 resize-none pr-10"
                  />
                   {!disabled && (
                    <AudioRecorder
                        onTranscription={(text) => {
                            const currentComment = value[index].comment;
                            handleCommentChange(index, currentComment ? `${currentComment}\n${text}` : text);
                        }}
                        disabled={disabled}
                        />
                  )}
                </div>
              </div>
            )
          )
        })}
        {!disabled && (
           <div className="aspect-square">
            <Dialog open={open} onOpenChange={setOpen}>
              {addImageButton}
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Add an Image</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-4">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" /> Upload from Computer
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" multiple />
                    <Button variant="outline" onClick={openCamera}>
                      <Camera className="mr-2 h-4 w-4" /> Take a Picture
                    </Button>
                </div>
              </DialogContent>
            </Dialog>
           </div>
        )}
      </div>

       <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="p-0 sm:p-6 w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-lg">
          <DialogHeader className="p-6 pb-0 sm:p-0">
            <DialogTitle>Camera</DialogTitle>
          </DialogHeader>
          {hasCameraPermission === false && (
            <div className="p-6 pt-0 sm:p-0">
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser to use this feature. You may need to refresh the page.
                </AlertDescription>
              </Alert>
            </div>
          )}
            <div className="bg-black sm:rounded-md overflow-hidden flex-grow flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline/>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <DialogFooter className="p-6 pt-0 sm:p-0 sm:mt-4 gap-2 sm:justify-between flex-col-reverse sm:flex-row">
              {devices.length > 1 && (
                <Button variant="outline" onClick={flipCamera}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Flip Camera
                </Button>
              )}
              <Button onClick={takePicture} disabled={!hasCameraPermission} className='w-full sm:w-auto'>
                <Camera className="mr-2 h-4 w-4" /> Take Picture
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="bg-transparent border-0 shadow-none p-0 max-w-none w-screen h-screen">
          {selectedImage && (
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
