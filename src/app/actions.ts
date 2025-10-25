"use server";

import { predictEntryPoints } from "@/ai/flows/predict-entry-points";
import { DUMMY_CHART_IMAGE_DATA_URI, mockBinanceData } from "@/lib/mock-data";
import { Prediction } from "@/lib/types";

export async function getAIPrediction(
  prevState: { prediction: Prediction | null; error: string | null },
  formData: FormData
): Promise<{ prediction: Prediction | null; error: string | null }> {
  try {
    const tradingPair = formData.get("tradingPair") as string || "BTCUSDT";
    
    const prediction = await predictEntryPoints({
      binanceData: mockBinanceData(tradingPair),
      tradingViewChart: DUMMY_CHART_IMAGE_DATA_URI,
      accountBalance: 100,
      tradingPair: tradingPair
    });
    
    if (!prediction || !prediction.entryPoint) {
       return { prediction: null, error: "AI failed to generate a valid prediction. Please try again." };
    }

    return { prediction: { ...prediction, tradingPair }, error: null };
  } catch (error) {
    console.error(error);
    return { prediction: null, error: "An unexpected error occurred. Please check the server logs." };
  }
}
