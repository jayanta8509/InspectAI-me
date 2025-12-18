
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Checkpoint } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteCheckpoint } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface CheckpointsClientProps {
  checkpoints: Checkpoint[];
}

export function CheckpointsClient({ checkpoints }: CheckpointsClientProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleDelete = (id: string) => {
        if(confirm('Are you sure you want to delete this checkpoint?')) {
            deleteCheckpoint(id);
            toast({
                title: "Checkpoint Deleted",
                description: "The checkpoint has been successfully deleted.",
            });
            router.refresh();
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Checkpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Product Categories</TableHead>
              <TableHead>Sample Purposes</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkpoints.map((checkpoint) => (
              <TableRow key={checkpoint.id}>
                <TableCell className="font-medium">{checkpoint.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{checkpoint.category}</Badge>
                </TableCell>
                 <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {checkpoint.clients && checkpoint.clients.length > 0 ? (
                      checkpoint.clients.map(c => <Badge key={c} variant="secondary">{c}</Badge>)
                    ) : (
                      <span className="text-muted-foreground text-xs">All</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {checkpoint.productCategories && checkpoint.productCategories.length > 0 ? (
                        checkpoint.productCategories.map(pc => <Badge key={pc} variant="secondary">{pc}</Badge>)
                        ) : (
                        <span className="text-muted-foreground text-xs">All</span>
                        )}
                    </div>
                </TableCell>
                 <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {checkpoint.samplePurposes && checkpoint.samplePurposes.length > 0 ? (
                        checkpoint.samplePurposes.map(sp => <Badge key={sp} variant="secondary">{sp}</Badge>)
                        ) : (
                        <span className="text-muted-foreground text-xs">All</span>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/checkpoints/edit/${checkpoint.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(checkpoint.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
