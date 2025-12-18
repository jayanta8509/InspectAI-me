
import { PageHeader } from "@/components/page-header";
import { CheckpointForm } from "../_components/checkpoint-form";

export default function NewCheckpointPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <PageHeader
        title="Create New Checkpoint"
        description="Add a new item to the master list of inspection checkpoints."
      />
      <CheckpointForm />
    </div>
  );
}
