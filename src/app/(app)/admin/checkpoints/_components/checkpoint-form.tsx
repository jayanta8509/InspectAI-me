
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Checkpoint } from '@/lib/types';
import { addCheckpoint, updateCheckpoint, clients, productCategories, samplePurposes } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';


const checkpointSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  clients: z.array(z.string()).optional(),
  productCategories: z.array(z.string()).optional(),
  samplePurposes: z.array(z.string()).optional(),
});

type CheckpointFormValues = z.infer<typeof checkpointSchema>;

interface CheckpointFormProps {
  checkpoint?: Checkpoint;
}

export function CheckpointForm({ checkpoint }: CheckpointFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!checkpoint;

  const form = useForm<CheckpointFormValues>({
    resolver: zodResolver(checkpointSchema),
    defaultValues: {
      title: checkpoint?.title || '',
      category: checkpoint?.category || '',
      description: checkpoint?.description || '',
      clients: checkpoint?.clients || [],
      productCategories: checkpoint?.productCategories || [],
      samplePurposes: checkpoint?.samplePurposes || [],
    },
  });

  function onSubmit(values: CheckpointFormValues) {
    if (isEditing) {
      updateCheckpoint({ ...checkpoint, ...values });
      toast({ title: 'Checkpoint Updated', description: 'The checkpoint has been successfully updated.' });
    } else {
      addCheckpoint(values);
      toast({ title: 'Checkpoint Added', description: 'The new checkpoint has been successfully added.' });
    }
    router.push('/admin/checkpoints');
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Checkpoint' : 'New Checkpoint'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update the details for this checkpoint.' : 'Fill out the form to create a new checkpoint.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Surface Finish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Visual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what to inspect for..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="clients"
                render={() => (
                    <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">Clients</FormLabel>
                        <FormDescription>
                        Select clients this checkpoint applies to. Leave blank for all.
                        </FormDescription>
                    </div>
                    <div className="space-y-2">
                    {clients.map((client) => (
                        <FormField
                        key={client}
                        control={form.control}
                        name="clients"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={client}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(client)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), client])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== client
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {client}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="productCategories"
                render={() => (
                    <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">Product Categories</FormLabel>
                        <FormDescription>
                        Select product categories this checkpoint applies to. Leave blank for all.
                        </FormDescription>
                    </div>
                     <div className="space-y-2">
                    {productCategories.map((category) => (
                        <FormField
                        key={category}
                        control={form.control}
                        name="productCategories"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={category}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), category])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== category
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {category}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="samplePurposes"
                render={() => (
                    <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">Sample Purposes</FormLabel>
                        <FormDescription>
                        Select sample purposes this checkpoint applies to. Leave blank for all.
                        </FormDescription>
                    </div>
                     <div className="space-y-2">
                    {samplePurposes.map((purpose) => (
                        <FormField
                        key={purpose}
                        control={form.control}
                        name="samplePurposes"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={purpose}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(purpose)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), purpose])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== purpose
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {purpose}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Checkpoint'}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
