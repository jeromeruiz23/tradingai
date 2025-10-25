'use server';

/**
 * @fileOverview Explains the rationale behind a predicted trade entry point.
 *
 * - explainEntryRationale - A function that explains the rationale behind a predicted entry point.
 * - ExplainEntryRationaleInput - The input type for the explainEntryRationale function.
 * - ExplainEntryRationaleOutput - The return type for the explainEntryRationale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainEntryRationaleInputSchema = z.object({
  tradingPair: z.string().describe('The trading pair (e.g., BTCUSDT).'),
  timeframe: z.string().describe('The timeframe for the chart (e.g., 15m, 1h, 4h).'),
  entryPoint: z.number().describe('The predicted entry point price.'),
  technicalIndicators: z
    .string()
    .describe('A list of technical indicators used in the analysis (e.g., RSI, MACD, Moving Averages).'),
  chartPatterns: z
    .string()
    .describe('A description of chart patterns observed (e.g., Head and Shoulders, Double Top).'),
});
export type ExplainEntryRationaleInput = z.infer<typeof ExplainEntryRationaleInputSchema>;

const ExplainEntryRationaleOutputSchema = z.object({
  rationale: z
    .string()
    .describe(
      'A detailed explanation of the rationale behind the predicted entry point, including how technical indicators and chart patterns support the prediction.'
    ),
  riskRewardAnalysis: z
    .string()
    .describe('An analysis of the potential risk and reward associated with the predicted entry point.'),
});
export type ExplainEntryRationaleOutput = z.infer<typeof ExplainEntryRationaleOutputSchema>;

export async function explainEntryRationale(
  input: ExplainEntryRationaleInput
): Promise<ExplainEntryRationaleOutput> {
  return explainEntryRationaleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainEntryRationalePrompt',
  input: {schema: ExplainEntryRationaleInputSchema},
  output: {schema: ExplainEntryRationaleOutputSchema},
  prompt: `You are an AI trading assistant that explains the rationale behind predicted entry points in trading.

  Trading Pair: {{tradingPair}}
  Timeframe: {{timeframe}}
  Entry Point: {{entryPoint}}
  Technical Indicators: {{technicalIndicators}}
  Chart Patterns: {{chartPatterns}}

  Provide a clear and concise explanation of why this entry point is suitable based on the provided information. Include an analysis of potential risks and rewards.
  The rationale must be under 200 words.
  `,
});

const explainEntryRationaleFlow = ai.defineFlow(
  {
    name: 'explainEntryRationaleFlow',
    inputSchema: ExplainEntryRationaleInputSchema,
    outputSchema: ExplainEntryRationaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
