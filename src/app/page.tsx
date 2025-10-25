"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { TradeChart, type TradeChartHandle } from "@/components/trade-chart";
import { AIPredictionPanel } from "@/components/ai-prediction-panel";
import { TradeHistory } from "@/components/trade-history";
import type { Trade, Prediction } from "@/lib/types";
import { initialTrades } from "@/lib/mock-data";

export default function Home() {
  const [trades, setTrades] = React.useState<Trade[]>(initialTrades);
  const [selectedPair, setSelectedPair] = React.useState("BTC/USDT");
  const chartRef = React.useRef<TradeChartHandle>(null);

  const handleExecuteTrade = (
    prediction: Prediction,
    type: "Buy" | "Sell"
  ) => {
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      pair: selectedPair,
      type,
      entryPrice: prediction.entryPoint,
      stopLoss: prediction.stopLoss,
      takeProfit: prediction.takeProfit,
      lotSize: prediction.lotSize,
      status: "Open",
      pnl: 0,
      reasoning: prediction.reasoning,
    };
    setTrades((prevTrades) => [newTrade, ...prevTrades]);
  };

  const handleCloseTrade = (tradeId: string) => {
    setTrades((prevTrades) =>
      prevTrades.map((trade) => {
        if (trade.id === tradeId) {
          // Simulate a random profit or loss outcome
          const outcome = Math.random() > 0.5 ? "profit" : "loss";
          const pnl =
            outcome === "profit"
              ? (trade.takeProfit - trade.entryPrice) * trade.lotSize
              : (trade.stopLoss - trade.entryPrice) * trade.lotSize;

          return {
            ...trade,
            status: "Closed",
            pnl: parseFloat(pnl.toFixed(2)),
          };
        }
        return trade;
      })
    );
  };
  
  const handleAnalysis = async () => {
    const dataUrl = await chartRef.current?.takeScreenshot();
    if (dataUrl) {
      return dataUrl;
    }
    return null;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4">
            <TradeChart ref={chartRef} selectedPair={selectedPair} onPairChange={setSelectedPair} />
            <TradeHistory trades={trades} onCloseTrade={handleCloseTrade} />
          </div>
          <AIPredictionPanel 
            key={selectedPair} 
            onExecuteTrade={handleExecuteTrade} 
            selectedPair={selectedPair}
            onAnalysis={handleAnalysis}
          />
        </div>
      </main>
    </div>
  );
}
