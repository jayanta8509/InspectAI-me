
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getInspection, checkpoints } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { InspectionReportForm } from './_components/inspection-report-form';
import { Button } from '@/components/ui/button';
import { FileLock, Printer } from 'lucide-react';
import type { Inspection } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function InspectionPage() {
  const params = useParams();
  const id = params.id as string;
  const [inspection, setInspection] = useState<Inspection | null | undefined>(undefined);

  useEffect(() => {
    const foundInspection = getInspection(id);
    setInspection(foundInspection);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (inspection === undefined) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader title="">
            <Skeleton className="h-11 w-40" />
        </PageHeader>
        <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!inspection) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={inspection.title}
        description={`Report for ${inspection.product.name} (${inspection.product.category}) — ${inspection.client} — ${inspection.samplePurpose}`}
      >
        <div className="flex items-center gap-2">
            <Button size="lg" variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
            </Button>
            <Button size="lg" disabled={inspection.status === 'Completed'}>
              <FileLock className="mr-2 h-4 w-4" />
              Finalize Report
            </Button>
        </div>
      </PageHeader>
      
      <div className="space-y-4">
        {inspection && <InspectionReportForm inspection={inspection} allCheckpoints={checkpoints} />}
      </div>
    </div>
  );
}
