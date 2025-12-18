
'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { audioTranscription } from '@/ai/flows/audio-transcription.flow';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onTranscription, disabled }: AudioRecorderProps) {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'prompt' | 'denied'>('prompt');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial permission status silently if possible
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then(status => {
        setPermissionStatus(status.state);
        status.onchange = () => {
          setPermissionStatus(status.state);
        };
      });
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus('granted');
      return stream;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setPermissionStatus('denied');
      return null;
    }
  };


  const startRecording = async () => {
    const stream = await requestMicrophone();
    if (!stream) {
      if (permissionStatus === 'denied') {
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser settings to record audio.",
        });
      }
      return;
    }

    setIsRecording(true);
    setTimer(0);
    
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    audioChunksRef.current = [];
    const options = { mimeType: 'audio/webm;codecs=opus' };
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      if (audioBlob.size < 1000) {
          toast({
              variant: "destructive",
              title: "Recording too short",
              description: "Please record for at least 1 second."
          });
          return;
      }

      setIsTranscribing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result as string;
            const result = await audioTranscription({ audioDataUri: base64Audio });
            onTranscription(result.transcription);
            toast({
              title: "Transcription Complete",
              description: "Your audio note has been converted to text.",
            });
          } catch (error) {
             console.error('Transcription failed:', error);
            toast({
              variant: "destructive",
              title: "Transcription Failed",
              description: "Could not transcribe audio at this time.",
            });
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      } catch (error) {
        console.error('Error reading audio blob:', error);
        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: "Could not process recorded audio.",
        });
        setIsTranscribing(false);
      }
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  

  if (permissionStatus === 'denied') {
    return null;
  }

  const buttonWrapperClasses = "absolute right-1 top-1";

  return (
      <div className={cn("flex items-center gap-2", buttonWrapperClasses)}>
        {isRecording && (
          <span className="text-sm font-mono text-muted-foreground">{formatTime(timer)}</span>
        )}
        
        {isTranscribing ? (
           <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled>
                <Loader className="h-4 w-4 animate-spin" />
            </Button>
        ) : isRecording ? (
            <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={stopRecording}
                disabled={disabled}
            >
                <StopCircle className="h-4 w-4" />
            </Button>
        ) : (
            <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={startRecording}
                disabled={disabled}
            >
                <Mic className="h-4 w-4" />
                <span className="sr-only">Record audio note</span>
            </Button>
        )}
    </div>
  );
}
