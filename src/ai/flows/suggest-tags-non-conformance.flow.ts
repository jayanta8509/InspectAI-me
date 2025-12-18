'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for non-conformance checkpoints during QA inspections.
 *
 * - suggestTagsForNonConformance - A function that takes non-conformance text as input and returns a list of suggested tags.
 * - SuggestTagsForNonConformanceInput - The input type for the suggestTagsForNonConformance function.
 * - SuggestTagsForNonConformanceOutput - The return type for the suggestTagsForNonConformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsForNonConformanceInputSchema = z.object({
  nonConformanceText: z
    .string()
    .describe(
      'The text describing the non-conformance issue noted during the QA inspection checkpoint.'
    ),
});
export type SuggestTagsForNonConformanceInput = z.infer<typeof SuggestTagsForNonConformanceInputSchema>;

const SuggestTagsForNonConformanceOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('An array of suggested tags relevant to the non-conformance issue.'),
});
export type SuggestTagsForNonConformanceOutput = z.infer<typeof SuggestTagsForNonConformanceOutputSchema>;

export async function suggestTagsForNonConformance(
  input: SuggestTagsForNonConformanceInput
): Promise<SuggestTagsForNonConformanceOutput> {
  return suggestTagsForNonConformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsForNonConformancePrompt',
  input: {schema: SuggestTagsForNonConformanceInputSchema},
  output: {schema: SuggestTagsForNonConformanceOutputSchema},
  prompt: `You are an AI assistant specializing in QA inspections, particularly in tagging non-conformance issues.

  Given the following text describing a non-conformance, suggest relevant tags that can be used to categorize and track the issue.
  Return ONLY the tags. Do not return any explanation or conversational text. Return tags as a JSON array of strings. Here is the non-conformance text:

  {{nonConformanceText}}`,
});

const suggestTagsForNonConformanceFlow = ai.defineFlow(
  {
    name: 'suggestTagsForNonConformanceFlow',
    inputSchema: SuggestTagsForNonConformanceInputSchema,
    outputSchema: SuggestTagsForNonConformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
