
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles, Volume2, Loader, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { generateInspectionSummary } from '@/ai/flows/generate-inspection-summary.flow';
import { Badge } from '@/components/ui/badge';
import { AudioRecorder } from './audio-recorder';
import { textToSpeech } from '@/ai/flows/text-to-speech.flow';
import { cn } from '@/lib/utils';

interface ConclusionSectionProps {
  form: UseFormReturn<any>;
}

function TagCloud({ control }: { control: any }) {
  const checkpoints = useWatch({ control, name: 'checkpoints' });

  if (!checkpoints) return null;

  const tagCounts: Record<string, number> = checkpoints
    .flatMap((c: any) => c.tags || [])
    .reduce((acc: Record<string, number>, tag: string) => {
      if (tag) {
        acc[tag] = (acc[tag] || 0) + 1;
      }
      return acc;
    }, {});
  
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  if (sortedTags.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Tag Cloud</h3>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(([tag, count]) => (
          <Badge key={tag} variant="secondary" className="text-sm">
            {tag} <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs">{count}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}


export function ConclusionSection({ form }: ConclusionSectionProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReadingShort, setIsReadingShort] = useState(false);
  const [isReadingLong, setIsReadingLong] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const values = form.getValues();
      const allTags = values.checkpoints.flatMap((c: any) => c.tags || []);
      const input = {
        checkpoints: values.checkpoints.map((c: any) => `Status: ${c.status}, Notes: ${c.notes}`),
        generalComments: values.generalComments,
        conformanceStatement: values.conformanceStatement,
        nextSteps: values.nextSteps,
        tags: [...new Set(allTags)], // Pass unique tags
      };

      const result = await generateInspectionSummary(input);
      form.setValue('shortSummary', result.shortSummary);
      form.setValue('longSummary', result.longSummary);
      toast({
        title: 'Summary Generated',
        description: 'AI has created short and long summaries for this report.',
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate summary at this time.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReadAloud = async (text: string, type: 'short' | 'long') => {
    if (!text) {
      toast({ variant: 'destructive', title: 'Nothing to read', description: 'The summary is empty.' });
      return;
    }
    
    if (type === 'short') setIsReadingShort(true);
    else setIsReadingLong(true);

    try {
      const result = await textToSpeech({ textToSynthesize: text });
      if (result.audioDataUri) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(result.audioDataUri);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => {
           if (type === 'short') setIsReadingShort(false);
           else setIsReadingLong(false);
        }
      }
    } catch (error) {
      console.error('Failed to generate speech:', error);
      toast({
        variant: 'destructive',
        title: 'Read Aloud Failed',
        description: 'Could not generate audio at this time.',
      });
       if (type === 'short') setIsReadingShort(false);
       else setIsReadingLong(false);
    }
  };

  const isDisabled = form.formState.disabled;

  return (
    <AccordionItem value="conclusion" className="border bg-card rounded-lg shadow-sm print-new-page">
      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-t-lg data-[state=closed]:rounded-b-lg data-[state=open]:border-b">
        <div className="flex items-center gap-4">
          <FileText className="w-5 h-5" />
          <span className="font-semibold text-base">Conclusion & Summaries</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
         <CardHeader className="sr-only">
          <CardTitle className="font-headline text-2xl">Conclusion</CardTitle>
          <CardDescription>Final comments, statements, and AI-powered summaries for the report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="generalComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Comments</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea placeholder="Overall thoughts on the inspection..." className="h-24 pr-10" {...field} />
                       <AudioRecorder
                        onTranscription={(text) => {
                            field.onChange(field.value ? `${field.value}\n${text}` : text);
                        }}
                        disabled={isDisabled}
                        />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Steps</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea placeholder="Recommended actions..." className="h-24 pr-10" {...field} />
                      <AudioRecorder
                        onTranscription={(text) => {
                            field.onChange(field.value ? `${field.value}\n${text}` : text);
                        }}
                        disabled={isDisabled}
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
            name="conformanceStatement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conformance Statement</FormLabel>
                <FormControl>
                   <div className="relative">
                      <Textarea placeholder="Final statement on product conformance..." {...field} className="pr-10" />
                      <AudioRecorder
                        onTranscription={(text) => {
                            field.onChange(field.value ? `${field.value}\n${text}` : text);
                        }}
                        disabled={isDisabled}
                        />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Generated Summary
              </h3>
              {!isDisabled && (
                <Button type="button" size="sm" onClick={handleGenerateSummary} disabled={isGenerating}>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name="shortSummary"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Short Summary</FormLabel>
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" disabled={isReadingShort || !field.value} onClick={() => handleReadAloud(field.value, 'short')}>
                      {isReadingShort ? <Loader className="h-4 w-4 animate-spin"/> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea placeholder="Awaiting AI generation..." {...field} readOnly={isDisabled} className="bg-background" rows={4} style={{ whiteSpace: 'pre-wrap' }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longSummary"
              render={({ field }) => (
                <FormItem>
                   <div className="flex items-center justify-between">
                    <FormLabel>Long Summary</FormLabel>
                     <Button type="button" size="icon" variant="ghost" className="h-7 w-7" disabled={isReadingLong || !field.value} onClick={() => handleReadAloud(field.value, 'long')}>
                      {isReadingLong ? <Loader className="h-4 w-4 animate-spin"/> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea placeholder="Awaiting AI generation..." {...field} readOnly={isDisabled} className="h-40 bg-background" style={{ whiteSpace: 'pre-wrap' }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <TagCloud control={form.control} />

        </CardContent>
      </AccordionContent>
    </AccordionItem>
  );
}
