import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { inspections } from '@/lib/data';
import { InspectionCard } from './_components/inspection-card';

export default function DashboardPage() {
  const inProgressInspections = inspections.filter(
    (insp) => insp.status === 'In Progress'
  );
  const completedInspections = inspections.filter(
    (insp) => insp.status === 'Completed'
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your QA inspections."
      >
        <Button asChild>
          <Link href="/inspections/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Inspection
          </Link>
        </Button>
      </PageHeader>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">In Progress</h2>
          {inProgressInspections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {inProgressInspections.map((inspection) => (
                <InspectionCard key={inspection.id} inspection={inspection} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No inspections currently in progress.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold font-headline mb-4">Completed</h2>
          {completedInspections.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedInspections.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))}
          </div>
           ) : (
            <p className="text-muted-foreground">No completed inspections yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
