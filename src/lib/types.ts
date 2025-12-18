import type { PlaceHolderImages } from "./placeholder-images";

export type ImagePlaceholderId = (typeof PlaceHolderImages)[number]['id'];
export type ImageValue = ImagePlaceholderId | `data:image/${string}`;

export interface ReportImage {
  src: ImageValue;
  comment: string;
}

export interface Checkpoint {
  id: string;
  category: string;
  title: string;
  description: string;
  clients?: string[];
  productCategories?: string[];
  samplePurposes?: string[];
}

export type ConformanceStatus = 'Conform' | 'Non-Conform';

export interface ReportCheckpoint {
  checkpointId: string;
  status: ConformanceStatus;
  pcsChecked: number;
  pcsConform: number;
  pcsNonConform: number;
  notes: string;
  images: ReportImage[];
  tags: string[];
  // The following properties are for custom checkpoints
  isCustom?: boolean;
  title?: string;
  category?: string;
  description?: string;
}

export interface Inspection {
  id: string;
  title: string;
  product: {
    name: string;
    category: string;
    type: string;
    image: ImagePlaceholderId;
  };
  client: string;
  samplePurpose: string;
  date: string;
  status: 'In Progress' | 'Completed';
  inspector: {
    name: string;
    avatar: ImagePlaceholderId;
  };
  checkpoints: ReportCheckpoint[];
  generalComments: string;
  conformanceStatement: string;
  nextSteps: string;
  shortSummary: string;
  longSummary: string;
}
