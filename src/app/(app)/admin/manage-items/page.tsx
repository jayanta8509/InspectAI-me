
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { clients, productCategories, samplePurposes, addClient, deleteClient, addProductCategory, deleteProductCategory, addSamplePurpose, deleteSamplePurpose } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Trash2, X } from 'lucide-react';

const clientSchema = z.object({
    name: z.string().min(1, 'Client name is required'),
});

const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
});

const purposeSchema = z.object({
    name: z.string().min(1, 'Purpose name is required'),
});

export default function ManageItemsPage() {
    const router = useRouter();
    const { toast } = useToast();

    const clientForm = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: { name: '' },
    });

    const categoryForm = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '' },
    });

    const purposeForm = useForm({
        resolver: zodResolver(purposeSchema),
        defaultValues: { name: '' },
    });

    const handleAddClient = (values: z.infer<typeof clientSchema>) => {
        addClient(values.name);
        toast({ title: "Client Added" });
        clientForm.reset();
        router.refresh();
    };

    const handleDeleteClient = (client: string) => {
        deleteClient(client);
        toast({ title: "Client Removed" });
        router.refresh();
    };

    const handleAddCategory = (values: z.infer<typeof categorySchema>) => {
        addProductCategory(values.name);
        toast({ title: "Category Added" });
        categoryForm.reset();
        router.refresh();
    };

    const handleDeleteCategory = (category: string) => {
        deleteProductCategory(category);
        toast({ title: "Category Removed" });
        router.refresh();
    };

    const handleAddPurpose = (values: z.infer<typeof purposeSchema>) => {
        addSamplePurpose(values.name);
        toast({ title: "Sample Purpose Added" });
        purposeForm.reset();
        router.refresh();
    };

    const handleDeletePurpose = (purpose: string) => {
        deleteSamplePurpose(purpose);
        toast({ title: "Sample Purpose Removed" });
        router.refresh();
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <PageHeader
                title="Manage Items"
                description="Add or remove clients, product categories, and sample purposes."
            />
            <div className="grid lg:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Clients</CardTitle>
                        <CardDescription>Manage the list of available clients.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {clients.map(client => (
                                <Badge key={client} variant="secondary" className="text-base flex items-center gap-2">
                                    {client}
                                    <button onClick={() => handleDeleteClient(client)} className="rounded-full hover:bg-black/10">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                         <Form {...clientForm}>
                            <form onSubmit={clientForm.handleSubmit(handleAddClient)} className="flex gap-2 items-start">
                                <FormField
                                control={clientForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className='flex-grow'>
                                        <FormControl>
                                            <Input {...field} placeholder="New client name..."/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Add Client</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Product Categories</CardTitle>
                        <CardDescription>Manage the list of product categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {productCategories.map(cat => (
                                <Badge key={cat} variant="secondary" className="text-base flex items-center gap-2">
                                    {cat}
                                    <button onClick={() => handleDeleteCategory(cat)} className="rounded-full hover:bg-black/10">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                         <Form {...categoryForm}>
                            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="flex gap-2 items-start">
                                <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Input {...field} placeholder="New category name..."/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Add Category</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Sample Purposes</CardTitle>
                        <CardDescription>Manage the list of sample purposes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {samplePurposes.map(purpose => (
                                <Badge key={purpose} variant="secondary" className="text-base flex items-center gap-2">
                                    {purpose}
                                    <button onClick={() => handleDeletePurpose(purpose)} className="rounded-full hover:bg-black/10">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                         <Form {...purposeForm}>
                            <form onSubmit={purposeForm.handleSubmit(handleAddPurpose)} className="flex gap-2 items-start">
                                <FormField
                                control={purposeForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Input {...field} placeholder="New purpose..."/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <Button type="submit">Add Purpose</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
