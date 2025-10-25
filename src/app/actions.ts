"use server";

import { predictEntryPoints } from "@/ai/flows/predict-entry-points";
import { Prediction } from "@/lib/types";

async function getBinanceData(tradingPair: string): Promise<string> {
  try {
    const klinesUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${tradingPair}&interval=1m&limit=50`;
    const tickerUrl = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${tradingPair}`;

    const [klinesResponse, tickerResponse] = await Promise.all([
      fetch(klinesUrl),
      fetch(tickerUrl),
    ]);

    if (!klinesResponse.ok || !tickerResponse.ok) {
      throw new Error(`Failed to fetch data from Binance Futures. Status: ${klinesResponse.status}, ${tickerResponse.status}`);
    }

    const klinesData = await klinesResponse.json();
    const tickerData = await tickerResponse.json();

    const latestKline = klinesData[klinesData.length - 1];
    const price = parseFloat(latestKline[4]).toFixed(6);

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
    const tradingPairPerp = `${tradingPair}PERP`;
    
    const binanceData = await getBinanceData(tradingPair);

    const prediction = await predictEntryPoints({
      binanceData: binanceData,
      accountBalance: 100,
      tradingPair: tradingPairPerp
    });
    
    if (!prediction || !prediction.entryPoint) {
       return { prediction: null, error: "AI failed to generate a valid prediction. Please try again." };
    }

    const formattedPrediction: Prediction = {
        ...prediction,
        entryPoint: parseFloat(prediction.entryPoint.toFixed(6)),
        stopLoss: parseFloat(prediction.stopLoss.toFixed(6)),
        takeProfit: parseFloat(prediction.takeProfit.toFixed(6)),
        tradingPair: tradingPair.replace('PERP', '')
    }

    return { prediction: formattedPrediction, error: null };
  } catch (error: any) {
    console.error(error);
    return { prediction: null, error: error.message || "An unexpected error occurred. Please check the server logs." };
  }
}
