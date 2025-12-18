import { checkpoints } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { CheckpointsClient } from "./_components/checkpoints-client";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListChecks } from "lucide-react";
import Link from "next/link";

export default function CheckpointsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Checkpoint Management"
        description="Define and organize QA checkpoints for different products and clients."
      >
        <div className="flex gap-2">
           <Button asChild>
            <Link href="/admin/manage-items">
                <ListChecks className="mr-2 h-4 w-4" />
                Manage Items
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/checkpoints/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Checkpoint
            </Link>
          </Button>
        </div>
      </PageHeader>
      
      <CheckpointsClient checkpoints={checkpoints} />
    </div>
  );
}
