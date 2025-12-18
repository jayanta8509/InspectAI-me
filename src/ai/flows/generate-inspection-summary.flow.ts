
'use server';

/**
 * @fileOverview Generates short and long summaries of inspection reports using AI.
 *
 * - generateInspectionSummary - A function that generates the inspection summary.
 * - GenerateInspectionSummaryInput - The input type for the generateInspectionSummary function.
 * - GenerateInspectionSummaryOutput - The return type for the generateInspectionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspectionSummaryInputSchema = z.object({
  checkpoints: z.array(z.string()).describe('The list of checkpoints from the inspection report.'),
  generalComments: z.string().describe('General comments from the inspection report.'),
  conformanceStatement: z.string().describe('Conformance statement from the inspection report.'),
  nextSteps: z.string().describe('Next steps from the inspection report.'),
  tags: z.array(z.string()).describe('List of tags associated with the inspection report.'),
});
export type GenerateInspectionSummaryInput = z.infer<typeof GenerateInspectionSummaryInputSchema>;

const GenerateInspectionSummaryOutputSchema = z.object({
  shortSummary: z.string().describe('A short summary of the inspection report in point form. Each point must be on a new line, each point starts with the charecter "-" to indicate a point.'),
  longSummary: z.string().describe('A long summary of the inspection report in point form. Each point must be on a new line, each point starts with the charecter "-" to indicate a point.'),
});
export type GenerateInspectionSummaryOutput = z.infer<typeof GenerateInspectionSummaryOutputSchema>;

export async function generateInspectionSummary(input: GenerateInspectionSummaryInput): Promise<GenerateInspectionSummaryOutput> {
  return generateInspectionSummaryFlow(input);
}

const generateInspectionSummaryPrompt = ai.definePrompt({
  name: 'generateInspectionSummaryPrompt',
  input: {schema: GenerateInspectionSummaryInputSchema},
  output: {schema: GenerateInspectionSummaryOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing inspection reports for quality assurance. Analyze the following information from an inspection report and generate both a short and a long summary in point form. Each point must be on a new line.

Checkpoints: {{{checkpoints}}}
General Comments: {{{generalComments}}}
Conformance Statement: {{{conformanceStatement}}}
Next Steps: {{{nextSteps}}}
Tags: {{{tags}}}

Short Summary: Provide a concise summary of the key findings and overall conformance status in 2-3 bullet points.

Long Summary: Provide a detailed summary of the inspection report as a bulleted list, including all relevant information. Include insights gleaned from the tags and the relative frequency of the different tags.

Output the short summary and long summary as specified in point form, each point starts with the charecter "-" to indicate a point, with each point on a new line.`,
});

const generateInspectionSummaryFlow = ai.defineFlow(
  {
    name: 'generateInspectionSummaryFlow',
    inputSchema: GenerateInspectionSummaryInputSchema,
    outputSchema: GenerateInspectionSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateInspectionSummaryPrompt(input);
    return output!;
  }
);
