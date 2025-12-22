import type { Inspection, Checkpoint } from './types';
import { v4 as uuidv4 } from 'uuid';

export let checkpoints: Checkpoint[] = [
  { id: 'chk-1', category: 'Packaging', title: 'Carton Condition', description: 'Inspect for any damage, punctures, or water marks on the outer carton.' },
  { id: 'chk-2', category: 'Packaging', title: 'Labeling & Marking', description: 'Verify that all labels (shipping, product info, warnings) are correct, legible, and properly placed.' },
  { id: 'chk-3', category: 'Assembly', title: 'Component Check', description: 'Ensure all parts, hardware, and instructions are included as per the manual.' },
  { id: 'chk-4', category: 'Assembly', title: 'Ease of Assembly', description: 'Perform a trial assembly to check for alignment of holes, clarity of instructions, and overall ease.', samplePurposes: ['Sample for testing'] },
  { id: 'chk-5', category: 'Visual', title: 'Surface Finish', description: 'Inspect for scratches, dents, chips, bubbles, or inconsistencies in paint, varnish or stain.' },
  { id: 'chk-6', category: 'Visual', title: 'Color Consistency', description: 'Compare product color against the approved master sample under controlled lighting.', productCategories: ['Seating'] },
  { id: 'chk-7', category: 'Visual', title: 'Upholstery & Fabric', description: 'Check for tears, loose threads, stains, and pattern alignment on all fabric/leather parts.', productCategories: ['Seating'] },
  { id: 'chk-8', category: 'Functional', title: 'Stability & Levelness', description: 'Place on a level surface to check for wobbling. All feet/legs should be even.' },
  { id: 'chk-9', category: 'Functional', title: 'Moving Parts', description: 'Test all drawers, doors, and reclining mechanisms for smooth and correct operation.', productCategories: ['Storage'] },
  { id: 'chk-10', category: 'Measurement', title: 'Overall Dimensions', description: 'Verify that the product\'s height, width, and depth match the specifications within tolerance.' },
  { id: 'chk-11', category: 'Visual', title: 'Glass Inspection', description: 'Check for chips, cracks, or scratches on any glass components.', productCategories: ['Tables'], clients: ['The Design Collective'] },
];

export let inspections: Inspection[] = [
  {
    id: 'insp-001',
    title: 'Velvet Armchair - Pre-Shipment',
    product: {
      name: '"Evelyn" Velvet Armchair',
      category: 'Seating',
      type: 'Armchair',
      image: 'furniture-chair',
    },
    client: 'The Design Collective',
    samplePurpose: 'Sample for client review',
    date: '2024-07-28',
    status: 'Completed',
    inspector: { name: 'Jane Doe', avatar: 'user-avatar-1' },
    checkpoints: [
      { checkpointId: 'chk-1', status: 'Conform', pcsChecked: 10, pcsConform: 10, pcsNonConform: 0, notes: 'Carton is in good condition, no visible damage.', images: [], tags: [] },
      { checkpointId: 'chk-2', status: 'Conform', pcsChecked: 10, pcsConform: 10, pcsNonConform: 0, notes: 'All labels are correct and legible.', images: [], tags: [] },
      { checkpointId: 'chk-5', status: 'Non-Conform', pcsChecked: 10, pcsConform: 9, pcsNonConform: 1, notes: 'Minor scratch found on the back-left leg. Approximately 1cm long, does not affect structure but is visible on close inspection.', images: [{src: 'defect-scratch', comment: 'Close-up of the scratch.'}], tags: ['finish', 'cosmetic', 'scratch'] },
      { checkpointId: 'chk-6', status: 'Conform', pcsChecked: 10, pcsConform: 10, pcsNonConform: 0, notes: 'Color matches master sample.', images: [], tags: [] },
      { checkpointId: 'chk-7', status: 'Conform', pcsChecked: 10, pcsConform: 10, pcsNonConform: 0, notes: 'Upholstery is clean, no defects found.', images: [{src: 'fabric-texture', comment: 'Texture of the velvet.'}], tags: [] },
      { checkpointId: 'chk-8', status: 'Conform', pcsChecked: 10, pcsConform: 10, pcsNonConform: 0, notes: 'Chair is stable, no wobble.', images: [], tags: [] },
    ],
    generalComments: 'Overall, the product quality is high. Only one minor cosmetic issue was found. Production seems to be following specifications accurately.',
    conformanceStatement: 'Product conforms to all critical standards. Minor non-conformance in cosmetic finish noted.',
    nextSteps: 'Recommend to accept shipment. Suggest reviewing handling procedures to prevent scratches on legs.',
    shortSummary: 'The "Evelyn" Velvet Armchair inspection is complete. The product meets all functional and packaging standards, with only a minor cosmetic scratch on one leg. The shipment is recommended for acceptance.',
    longSummary: 'The pre-shipment inspection for the "Evelyn" Velvet Armchair, ordered by The Design Collective, was conducted on 2024-07-28. The inspection covered packaging, visual, and functional checkpoints. Packaging and labeling were found to be compliant. Functionally, the chair is stable and well-constructed. A single non-conformance was identified: a minor 1cm scratch on the back-left leg, which is cosmetic and does not impact the item\'s structural integrity. All other visual checks, including color and upholstery, conformed to the standards. Based on the tags, the issue is related to the "finish". Overall conformance is high, and the recommendation is to accept the shipment while advising the factory to improve handling processes to mitigate such cosmetic defects in the future.',
  },
  {
    id: 'insp-002',
    title: 'Oak Dining Table - In-Production',
    product: {
      name: '"Nordic" Oak Dining Table',
      category: 'Tables',
      type: 'Dining Table',
      image: 'wood-grain',
    },
    client: 'Scandi Living',
    samplePurpose: 'Sample for testing',
    date: '2024-08-02',
    status: 'In Progress',
    inspector: { name: 'Jane Doe', avatar: 'user-avatar-1' },
    checkpoints: [
      { checkpointId: 'chk-3', status: 'Conform', pcsChecked: 5, pcsConform: 5, pcsNonConform: 0, notes: '', images: [], tags: [], },
      { checkpointId: 'chk-5', status: 'Conform', pcsChecked: 5, pcsConform: 5, pcsNonConform: 0, notes: '', images: [], tags: [], },
      { checkpointId: 'chk-8', status: 'Conform', pcsChecked: 5, pcsConform: 5, pcsNonConform: 0, notes: '', images: [], tags: [], },
      { checkpointId: 'chk-10', status: 'Non-Conform', pcsChecked: 5, pcsConform: 4, pcsNonConform: 1, notes: 'Table width is 2cm over the maximum tolerance.', images: [], tags: ['measurement', 'specification'], },
    ],
    generalComments: '',
    conformanceStatement: '',
    nextSteps: '',
    shortSummary: '',
    longSummary: '',
  },
  {
    id: 'insp-003',
    title: 'Modular Sofa - DUPRO',
    product: {
      name: '"Connect" Modular Sofa',
      category: 'Seating',
      type: 'Sofa',
      image: 'furniture-sofa',
    },
    client: 'UrbanLoft',
    samplePurpose: 'Sample for mass production',
    date: '2024-07-30',
    status: 'In Progress',
    inspector: { name: 'Jane Doe', avatar: 'user-avatar-1' },
    checkpoints: [],
    generalComments: '',
    conformanceStatement: '',
    nextSteps: '',
    shortSummary: '',
    longSummary: '',
  },
];

export let clients = ['The Design Collective', 'Scandi Living', 'UrbanLoft', 'Modernica'];
export let productCategories = ['Seating', 'Tables', 'Storage'];
export let samplePurposes = ['Sample for testing', 'Sample for client review', 'Sample for mass production'];


export function addInspection(inspection: Inspection) {
  inspections.unshift(inspection);
}

export function getInspections() {
  return inspections;
}

export function getInspection(id: string) {
    return inspections.find(i => i.id === id);
}

export function getCheckpoint(id: string) {
  return checkpoints.find(c => c.id === id);
}

export function updateCheckpoint(updatedCheckpoint: Checkpoint) {
  const index = checkpoints.findIndex(c => c.id === updatedCheckpoint.id);
  if (index !== -1) {
    checkpoints[index] = updatedCheckpoint;
  }
}

export function addCheckpoint(checkpoint: Omit<Checkpoint, 'id'>) {
    const newCheckpoint: Checkpoint = {
        ...checkpoint,
        id: `chk-${uuidv4().slice(0,4)}`,
    }
    checkpoints.push(newCheckpoint);
}

export function deleteCheckpoint(id: string) {
  checkpoints = checkpoints.filter(c => c.id !== id);
}

export function addClient(client: string) {
    if (!clients.includes(client)) {
        clients.push(client);
    }
}

export function deleteClient(client: string) {
    clients = clients.filter(c => c !== client);
}

export function addProductCategory(category: string) {
    if(!productCategories.includes(category)) {
        productCategories.push(category);
    }
}

export function deleteProductCategory(category: string) {
    productCategories = productCategories.filter(c => c !== category);
}

export function addSamplePurpose(purpose: string) {
    if(!samplePurposes.includes(purpose)) {
        samplePurposes.push(purpose);
    }
}

export function deleteSamplePurpose(purpose: string) {
    samplePurposes = samplePurposes.filter(c => c !== purpose);
}



export function finalizeInspection(id: string) {
  console.log("id",id);
  
  const inspection = inspections.find(i => i.id === id);
  if (inspection) {
    inspection.status = 'Completed';
  }
}
