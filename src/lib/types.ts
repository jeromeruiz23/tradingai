import type { PredictEntryPointsOutput } from "@/ai/flows/predict-entry-points";

export type Prediction = PredictEntryPointsOutput & { tradingPair: string };

export type Trade = {
  id: string;
  pair: string;
  type: "Buy" | "Sell";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  status: "Open" | "Closed";
  pnl: number;
  reasoning: string;
};
