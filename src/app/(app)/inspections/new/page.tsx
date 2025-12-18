
"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from '@/components/page-header';
import { addInspection, checkpoints as allCheckpoints, clients, samplePurposes } from '@/lib/data';
import type { Inspection } from '@/lib/types';
import { products } from '@/lib/products';

const newInspectionSchema = z.object({
  productType: z.string().min(1, 'Product type is required'),
  client: z.string().min(1, 'Client is required'),
  samplePurpose: z.string().min(1, 'Sample purpose is required'),
});

type NewInspectionFormValues = z.infer<typeof newInspectionSchema>;

export default function NewInspectionPage() {
  const router = useRouter();

  const form = useForm<NewInspectionFormValues>({
    resolver: zodResolver(newInspectionSchema),
    defaultValues: {
      productType: '',
      client: '',
      samplePurpose: '',
    },
  });

  function onSubmit(values: NewInspectionFormValues) {
    const newInspectionId = `insp-${uuidv4().slice(0, 4)}`;
    const product = products.find(p => p.type === values.productType);

    if (!product) {
      console.error("Selected product not found");
      return;
    }
    
    const relevantCheckpoints = allCheckpoints.filter(checkpoint => {
      const clientMatch = !checkpoint.clients || checkpoint.clients.length === 0 || checkpoint.clients.includes(values.client);
      const categoryMatch = !checkpoint.productCategories || checkpoint.productCategories.length === 0 || checkpoint.productCategories.includes(product.category);
      const purposeMatch = !checkpoint.samplePurposes || checkpoint.samplePurposes.length === 0 || checkpoint.samplePurposes.includes(values.samplePurpose);
      return clientMatch && categoryMatch && purposeMatch;
    });

    const newInspection: Inspection = {
      id: newInspectionId,
      title: `${product.name} - Initial Inspection`,
      product: {
        name: product.name,
        category: product.category,
        type: product.type,
        image: product.image,
      },
      client: values.client,
      samplePurpose: values.samplePurpose,
      date: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      inspector: {
        name: 'Jane Doe',
        avatar: 'user-avatar-1',
      },
      checkpoints: relevantCheckpoints.map(c => ({
        checkpointId: c.id,
        status: 'Conform',
        notes: '',
        images: [],
        tags: [],
        pcsChecked: 0,
        pcsConform: 0,
        pcsNonConform: 0,
      })),
      generalComments: '',
      conformanceStatement: '',
      nextSteps: '',
      shortSummary: '',
      longSummary: '',
    };
    
    addInspection(newInspection);
    router.push(`/inspections/${newInspectionId}`);
  }
  
  const productTypes = products.map(p => p.type);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <PageHeader
        title="New Inspection"
        description="Select the product, client, and purpose to begin a new QA report."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
              <CardDescription>
                These details determine which checkpoints are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map(client => <SelectItem key={client} value={client}>{client}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="samplePurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Purpose</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {samplePurposes.map(purpose => <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full md:w-auto">Start Inspection</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
