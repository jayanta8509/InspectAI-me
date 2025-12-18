import { config } from 'dotenv';
config();

import '@/ai/flows/audio-transcription.flow.ts';
import '@/ai/flows/generate-inspection-summary.flow.ts';
import '@/ai/flows/suggest-tags-non-conformance.flow.ts';
import '@/ai/flows/generate-report-summary.ts';
import '@/ai/flows/text-to-speech.flow.ts';
