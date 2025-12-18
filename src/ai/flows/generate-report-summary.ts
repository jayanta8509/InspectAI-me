'use server';

/**
 * @fileOverview Generates a detailed summary of an inspection report, highlighting key findings and recommendations.
 *
 * - generateReportSummary - A function that generates the inspection report summary.
 * - GenerateReportSummaryInput - The input type for the generateReportSummary function.
 * - GenerateReportSummaryOutput - The return type for the generateReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportSummaryInputSchema = z.object({
  checkpoints: z.array(z.string()).describe('The list of checkpoints from the inspection report.'),
  generalComments: z.string().describe('General comments from the inspection report.'),
  conformanceStatement: z.string().describe('Conformance statement from the inspection report.'),
  nextSteps: z.string().describe('Next steps from the inspection report.'),
  tags: z.array(z.string()).describe('List of tags associated with the inspection report.'),
});
export type GenerateReportSummaryInput = z.infer<typeof GenerateReportSummaryInputSchema>;

const GenerateReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the inspection report.'),
});
export type GenerateReportSummaryOutput = z.infer<typeof GenerateReportSummaryOutputSchema>;

export async function generateReportSummary(input: GenerateReportSummaryInput): Promise<GenerateReportSummaryOutput> {
  return generateReportSummaryFlow(input);
}

const generateReportSummaryPrompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: GenerateReportSummaryInputSchema},
  output: {schema: GenerateReportSummaryOutputSchema},
  prompt: `You are an AI assistant specializing in generating comprehensive summaries of inspection reports for quality assurance. Analyze the following information from an inspection report and generate a detailed summary, including key findings and recommendations.

Checkpoints: {{{checkpoints}}}
General Comments: {{{generalComments}}}
Conformance Statement: {{{conformanceStatement}}}
Next Steps: {{{nextSteps}}}
Tags: {{{tags}}}

Summary: Provide a detailed summary of the inspection report, including all relevant information, key findings, and recommendations for improvement.  Include insights gleaned from the tags and the relative frequency of the different tags. The length of the summary should be around 300 words.
`,
});

const generateReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateReportSummaryFlow',
    inputSchema: GenerateReportSummaryInputSchema,
    outputSchema: GenerateReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateReportSummaryPrompt(input);
    return output!;
  }
);
