'use server';

/**
 * @fileOverview An AI agent that predicts suitable entry points for trading.
 *
 * - predictEntryPoints - A function that predicts entry points and provides trading parameters.
 * - PredictEntryPointsInput - The input type for the predictEntryPoints function.
 * - PredictEntryPointsOutput - The return type for the predictEntryPoints function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictEntryPointsInputSchema = z.object({
  binanceData: z
    .string()
    .describe('Real-time data from Binance Futures.'),
  tradingViewChart: z
    .string()
    .describe('TradingView chart data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  accountBalance: z
    .number()
    .describe('The user account balance in USD.'),
  tradingPair: z
    .string()
    .describe('The trading pair (e.g., BTCUSDT).'),
});

export type PredictEntryPointsInput = z.infer<typeof PredictEntryPointsInputSchema>;

const PredictEntryPointsOutputSchema = z.object({
  entryPoint: z
    .number()
    .describe('The predicted entry point for the trade.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the predicted entry point.'),
  lotSize: z
    .number()
    .describe('The suggested lot size for the trade.'),
  stopLoss: z
    .number()
    .describe('The suggested stop loss for the trade.'),
  takeProfit: z
    .number()
    .describe('The suggested take profit for the trade.'),
  tradingPair: z
    .string()
    .optional()
    .describe('The trading pair for the prediction.'),
});

export type PredictEntryPointsOutput = z.infer<typeof PredictEntryPointsOutputSchema>;

export async function predictEntryPoints(
  input: PredictEntryPointsInput
): Promise<PredictEntryPointsOutput> {
  return predictEntryPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictEntryPointsPrompt',
  input: {schema: PredictEntryPointsInputSchema},
  output: {schema: PredictEntryPointsOutputSchema},
  prompt: `You are an AI trading assistant that analyzes Binance Futures data and TradingView charts to provide optimal trade entry points.

  Given the following information for {{tradingPair}}, predict the nearest or instant entry point for a trade, explain your reasoning, and suggest a lot size, stop loss, and take profit. The user has an account balance of $100, and you should risk around 20-30% of the account balance.

  Binance Data: {{{binanceData}}}
  TradingView Chart: {{media url=tradingViewChart}}
  Account Balance: $100
  Trading Pair: {{tradingPair}}

  Ensure the lot size, stop loss, and take profit are calculated based on risking 20%-30% of the $100 account balance.

  Here's how you should structure your response:
  - entryPoint: The predicted entry point for the trade.
  - reasoning: Explain the rationale behind the predicted entry point. Consider factors like support and resistance levels, chart patterns, and potential breakout points.
  - lotSize: The suggested lot size for the trade, calculated to risk around 20%-30% of the account balance.
  - stopLoss: The suggested stop loss for the trade, placed to limit potential losses.
  - takeProfit: The suggested take profit for the trade, placed to capture potential gains.
  - tradingPair: The trading pair for this prediction (e.g., BTCUSDT).
  `,
});

const predictEntryPointsFlow = ai.defineFlow(
  {
    name: 'predictEntryPointsFlow',
    inputSchema: PredictEntryPointsInputSchema,
    outputSchema: PredictEntryPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
