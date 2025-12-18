
'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from './image-uploader';
import { AudioRecorder } from './audio-recorder';
import { BrainCircuit, X, Trash2, GripVertical, FilePlus2 } from 'lucide-react';
import { suggestTagsForNonConformance } from '@/ai/flows/suggest-tags-non-conformance.flow';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CustomCheckpointItemProps {
  form: UseFormReturn<any>;
  index: number;
}


export function CustomCheckpointItem({ form, index }: CustomCheckpointItemProps) {
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const { toast } = useToast();
  const { remove } = useFieldArray({
    control: form.control,
    name: 'checkpoints',
  });


  const handleSuggestTags = async () => {
    const notes = form.getValues(`checkpoints.${index}.notes`);
    if (!notes) {
      toast({
        variant: 'destructive',
        title: 'Cannot Suggest Tags',
        description: 'Please enter some notes about the non-conformance first.',
      });
      return;
    }

    setIsSuggestingTags(true);
    try {
      const result = await suggestTagsForNonConformance({ nonConformanceText: notes });
      const currentTags = form.getValues(`checkpoints.${index}.tags`) || [];
      const newTags = result.suggestedTags.filter(tag => !currentTags.includes(tag));
      if(newTags.length > 0) {
        form.setValue(`checkpoints.${index}.tags`, [...currentTags, ...newTags]);
      }
       toast({
        title: 'Tags Suggested',
        description: 'AI has added new relevant tags.',
      });
    } catch (error) {
      console.error('Error suggesting tags:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not suggest tags at this time.',
      });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues(`checkpoints.${index}.tags`) || [];
    form.setValue(`checkpoints.${index}.tags`, currentTags.filter((tag: string) => tag !== tagToRemove));
  };

  const handleRemoveCheckpoint = () => {
    if (confirm('Are you sure you want to remove this custom checkpoint?')) {
        remove(index);
        toast({ title: 'Custom Checkpoint Removed' });
    }
  }
  
  return (
    <AccordionItem value={`chk-item-${index}`} className="border-dashed border-2 bg-card rounded-lg mb-4 shadow-sm print-new-page">
      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-t-lg data-[state=closed]:rounded-b-lg data-[state=open]:border-b">
        <div className="flex items-center gap-4">
          <FilePlus2 className="w-5 h-5 text-accent" />
          <span className="font-semibold text-base italic">Custom Checkpoint</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 pt-4 space-y-6">
        <div className='flex justify-end'>
            <Button type='button' variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveCheckpoint}>
                <Trash2 className="h-4 w-4 text-destructive"/>
                <span className="sr-only">Remove custom checkpoint</span>
            </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name={`checkpoints.${index}.title`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter a custom title..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name={`checkpoints.${index}.category`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter a category (e.g., Visual)" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name={`checkpoints.${index}.description`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Describe what to inspect..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="space-y-3">
            <FormLabel>Conformance</FormLabel>
            <div className='flex flex-wrap items-center gap-4'>
                <FormField
                    control={form.control}
                    name={`checkpoints.${index}.status`}
                    render={({ field }) => (
                        <FormItem className="flex-shrink-0">
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                            disabled={form.formState.disabled}
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Conform" />
                                </FormControl>
                                <FormLabel className="font-normal">Conform</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Non-Conform" />
                                </FormControl>
                                <FormLabel className="font-normal">Non-Conform</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex items-center gap-2'>
                    <FormField
                        control={form.control}
                        name={`checkpoints.${index}.pcsChecked`}
                        render={({ field }) => (
                            <FormItem className="w-24">
                            <FormLabel className="text-xs text-muted-foreground">Checked</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`checkpoints.${index}.pcsConform`}
                        render={({ field }) => (
                            <FormItem className="w-24">
                            <FormLabel className="text-xs text-muted-foreground">Conform</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`checkpoints.${index}.pcsNonConform`}
                        render={({ field }) => (
                            <FormItem className="w-24">
                            <FormLabel className="text-xs text-muted-foreground">Non-Conform</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>

        <FormField
            control={form.control}
            name={`checkpoints.${index}.notes`}
            render={({ field }) => (
            <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                <div className="relative">
                    <Textarea
                    placeholder="Describe findings..."
                    className="resize-none pr-10"
                    {...field}
                    />
                    <AudioRecorder
                    onTranscription={(text) => {
                        field.onChange(field.value ? `${field.value}\n${text}` : text);
                    }}
                    disabled={form.formState.disabled}
                    />
                </div>
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <div className="space-y-4">
            <FormField
            control={form.control}
            name={`checkpoints.${index}.tags`}
            render={({ field }) => (
                <FormItem>
                    <div className='flex items-center justify-between'>
                        <FormLabel>Tags</FormLabel>
                        {!form.formState.disabled && (
                            <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggestingTags}>
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            {isSuggestingTags ? 'Thinking...' : 'Suggest Tags'}
                            </Button>
                        )}
                    </div>
                <FormControl>
                    <div className="flex flex-wrap gap-2 rounded-md border min-h-10 p-2">
                    {(field.value || []).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className='flex items-center gap-1'>
                        {tag}
                        {!form.formState.disabled && (
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-black/10">
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove tag</span>
                            </button>
                        )}
                        </Badge>
                    ))}
                    </div>
                </FormControl>

                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name={`checkpoints.${index}.images`}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                    <ImageUploader 
                    value={field.value || []} 
                    onValueChange={field.onChange}
                    disabled={form.formState.disabled}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
