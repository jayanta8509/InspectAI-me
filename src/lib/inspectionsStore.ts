import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Inspection } from '@/lib/types';
import { inspections as initialData } from '@/lib/data';

interface InspectionStore {
  inspections: Inspection[];
  addInspection: (inspection: Inspection) => void;
  finalizeInspection: (id: string) => void;
}

export const useInspectionStore = create<InspectionStore>()(
  persist(
    (set) => ({
      inspections: initialData,

      addInspection: (inspection) =>
        set((state) => ({
          inspections: [inspection, ...state.inspections],
        })),

      finalizeInspection: (id) =>
        set((state) => ({
          inspections: state.inspections.map((i) =>
            i.id === id ? { ...i, status: 'Completed' } : i
          ),
        })),
    }),
    {
      name: 'inspection-store', // localStorage key
    }
  )
);
