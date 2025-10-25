"use server";

import { predictEntryPoints } from "@/ai/flows/predict-entry-points";
import { mockBinanceData } from "@/lib/mock-data";
import { Prediction } from "@/lib/types";

export async function getAIPrediction(
  prevState: { prediction: Prediction | null; error: string | null },
  formData: FormData
): Promise<{ prediction: Prediction | null; error: string | null }> {
  try {
    const tradingPair = formData.get("tradingPair") as string || "BTCUSDT";
    const chartImage = formData.get("chartImage") as string;
    
    if (!chartImage) {
      return { prediction: null, error: "Could not capture chart image. Please try again." };
    }
    
    const prediction = await predictEntryPoints({
      binanceData: mockBinanceData(tradingPair),
      tradingViewChart: chartImage,
      accountBalance: 100,
      tradingPair: `${tradingPair}PERP`
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
