
'use server';

/**
 * @fileOverview This file contains the Genkit flow for transcribing audio notes recorded during QA inspections.
 * - test
 * - audioTranscription - A function that handles the audio transcription process.
 * - AudioTranscriptionInput - The input type for the audioTranscription function.
 * - AudioTranscriptionOutput - The return type for the audioTranscription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';


const AudioTranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'  
    ),
});
export type AudioTranscriptionInput = z.infer<typeof AudioTranscriptionInputSchema>;

const AudioTranscriptionOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio recording, translated into English.'),
});
export type AudioTranscriptionOutput = z.infer<typeof AudioTranscriptionOutputSchema>;

export async function audioTranscription(input: AudioTranscriptionInput): Promise<AudioTranscriptionOutput> {
  return audioTranscriptionFlow(input);
}

const audioTranscriptionFlow = ai.defineFlow(
  {
    name: 'audioTranscriptionFlow',
    inputSchema: AudioTranscriptionInputSchema,
    outputSchema: AudioTranscriptionOutputSchema,
  },
  async input => {
    const response = await ai.generate({
      model: googleAI.model('gemini-2.5-pro'),
      prompt: [
        {text: 'You are an expert transcriber and translator. Transcribe the following audio recording to text. After transcribing, you MUST translate the entire transcription into English. The final output should ONLY be the English translation of the transcribed text. The audio is a voice note from a quality assurance inspector about a product defect.'},
        {media: {url: input.audioDataUri}},
      ],
      output: {
        schema: AudioTranscriptionOutputSchema,
      },
    });

    if (!response.output) {
      throw new Error('Transcription failed: The AI model did not return a valid output.');
    }

    return response.output;
  }
);
