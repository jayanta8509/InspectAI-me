import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, CheckCircle, Clock, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Inspection } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

interface InspectionCardProps {
  inspection: Inspection;
}

export function InspectionCard({ inspection }: InspectionCardProps) {
  const productImage = PlaceHolderImages.find(img => img.id === inspection.product.image);

  const nonConformances = inspection.checkpoints.filter(c => c.status === 'Non-Conform').length;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start gap-4">
          {productImage && (
            <Image
              src={productImage.imageUrl}
              alt={inspection.product.name}
              width={80}
              height={80}
              className="rounded-lg object-cover"
              data-ai-hint={productImage.imageHint}
            />
          )}
          <div className="flex-1">
            <CardTitle className="font-headline text-xl mb-1">{inspection.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" /> {inspection.client}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(inspection.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            {inspection.status === 'Completed' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
                <Clock className="w-4 h-4 text-yellow-500" />
            )}
            <Badge variant={inspection.status === 'Completed' ? 'secondary' : 'outline'}>
              {inspection.status}
            </Badge>
          </div>
          {inspection.status === 'Completed' && nonConformances > 0 && (
             <p className="text-destructive text-xs pt-2">
                {nonConformances} non-conformance(s) found.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={inspection.status === "In Progress" ? "default" : "secondary"}>
          <Link href={`/inspections/${inspection.id}`}>
            {inspection.status === 'In Progress' ? 'Continue Inspection' : 'View Report'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
