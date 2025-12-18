
'use client';
import { useParams, notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CheckpointForm } from "../../_components/checkpoint-form";
import { getCheckpoint } from "@/lib/data";

export default function EditCheckpointPage() {
    const params = useParams();
    const id = params.id as string;
    const checkpoint = getCheckpoint(id);

    if (!checkpoint) {
        notFound();
    }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <PageHeader
        title="Edit Checkpoint"
        description="Modify an existing inspection checkpoint."
      />
      <CheckpointForm checkpoint={checkpoint} />
    </div>
  );
}
