
'use client';

import type { Inspection, Checkpoint } from '@/lib/types';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  Form
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CheckpointItem } from './checkpoint-item';
import { CustomCheckpointItem } from './custom-checkpoint-item';
import { Accordion } from '@/components/ui/accordion';
import { ConclusionSection } from './conclusion-section';

const reportImageSchema = z.object({
  src: z.string().refine(val => val.startsWith('data:image/') || /^[a-z0-9-]+$/.test(val), {
    message: "Image must be a data URL or a valid ID",
  }),
  comment: z.string(),
});


const reportCheckpointSchema = z.object({
  checkpointId: z.string(),
  status: z.enum(['Conform', 'Non-Conform']),
  pcsChecked: z.coerce.number().min(0),
  pcsConform: z.coerce.number().min(0),
  pcsNonConform: z.coerce.number().min(0),
  notes: z.string(),
  images: z.array(reportImageSchema),
  tags: z.array(z.string()),
  // For custom checkpoints
  isCustom: z.boolean().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

const inspectionSchema = z.object({
  generalComments: z.string(),
  conformanceStatement: z.string(),
  nextSteps: z.string(),
  checkpoints: z.array(reportCheckpointSchema),
  shortSummary: z.string(),
  longSummary: z.string(),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

interface InspectionReportFormProps {
  inspection: Inspection;
  allCheckpoints: Checkpoint[];
}

export function InspectionReportForm({ inspection, allCheckpoints }: InspectionReportFormProps) {
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      generalComments: inspection.generalComments,
      conformanceStatement: inspection.conformanceStatement,
      nextSteps: inspection.nextSteps,
      checkpoints: inspection.checkpoints,
      shortSummary: inspection.shortSummary,
      longSummary: inspection.longSummary,
    },
    disabled: inspection.status === 'Completed',
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'checkpoints',
  });

  const handleAddCustomCheckpoint = () => {
    append({
        checkpointId: `custom-${uuidv4().slice(0,4)}`,
        isCustom: true,
        title: '',
        category: '',
        description: '',
        status: 'Conform',
        pcsChecked: 0,
        pcsConform: 0,
        pcsNonConform: 0,
        notes: '',
        images: [],
        tags: [],
    });
  }

  const onSubmit = (data: InspectionFormValues) => {
    console.log('Form submitted', data);
    // Here you would call a server action to save the data
  };

  const isDisabled = form.formState.disabled;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Accordion type="multiple" defaultValue={fields.map((_, index) => `chk-item-${index}`)} className="w-full space-y-4">
          {fields.map((field, index) => {
             if (field.isCustom) {
              return (
                 <CustomCheckpointItem
                    key={field.id}
                    form={form}
                    index={index}
                />
              )
            }
            const checkpointInfo = allCheckpoints.find(c => c.id === field.checkpointId);
            return checkpointInfo ? (
              <CheckpointItem
                key={field.id}
                checkpoint={{...checkpointInfo, ...field, id: field.id}}
                form={form}
                index={index}
              />
            ) : null
          })}
        </Accordion>
        
        {!isDisabled && (
            <div className="flex justify-start add-custom-checkpoint">
                <Button type="button" variant="outline" onClick={handleAddCustomCheckpoint}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Custom Checkpoint
                </Button>
            </div>
        )}
        
        <Accordion type="single" collapsible defaultValue='conclusion' className="w-full">
          <ConclusionSection form={form} />
        </Accordion>

      </form>
    </Form>
  );
}
