"use server";

import { predictEntryPoints } from "@/ai/flows/predict-entry-points";
import { Prediction } from "@/lib/types";

async function getBinanceData(tradingPair: string): Promise<string> {
  try {
    const klinesUrl = `https://api.binance.com/api/v3/klines?symbol=${tradingPair}&interval=1m&limit=50`;
    const tickerUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${tradingPair}`;

    const [klinesResponse, tickerResponse] = await Promise.all([
      fetch(klinesUrl),
      fetch(tickerUrl),
    ]);

    if (!klinesResponse.ok || !tickerResponse.ok) {
      throw new Error(`Failed to fetch data from Binance. Status: ${klinesResponse.status}, ${tickerResponse.status}`);
    }

    const klinesData = await klinesResponse.json();
    const tickerData = await tickerResponse.json();

    const latestKline = klinesData[klinesData.length - 1];
    const price = parseFloat(latestKline[4]).toFixed(2);

    const binanceData = {
      ticker: tradingPair,
      price: price,
      volume: tickerData.volume,
      high_24h: tickerData.highPrice,
      low_24h: tickerData.lowPrice,
      klines: klinesData.map((k: any) => ({
        openTime: k[0],
        open: k[1],
        high: k[2],
        low: k[3],
        close: k[4],
        volume: k[5],
        closeTime: k[6],
      })),
    };
    
    return JSON.stringify(binanceData, null, 2);
  } catch (error) {
    console.error("Error fetching Binance data:", error);
    throw new Error("Could not fetch live market data from Binance.");
  }
}


export async function getAIPrediction(
  prevState: { prediction: Prediction | null; error: string | null },
  formData: FormData
): Promise<{ prediction: Prediction | null; error: string | null }> {
  try {
    const tradingPair = formData.get("tradingPair") as string || "BTCUSDT";
    
    const binanceData = await getBinanceData(tradingPair);

    const prediction = await predictEntryPoints({
      binanceData: binanceData,
      accountBalance: 100,
      tradingPair: `${tradingPair}PERP`
    });
    
    if (!prediction || !prediction.entryPoint) {
       return { prediction: null, error: "AI failed to generate a valid prediction. Please try again." };
    }

    return { prediction: { ...prediction, tradingPair: tradingPair.replace('PERP', '') }, error: null };
  } catch (error: any) {
    console.error(error);
    return { prediction: null, error: error.message || "An unexpected error occurred. Please check the server logs." };
  }
}