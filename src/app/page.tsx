"use client";

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "@/components/header";
import { TradeChart } from "@/components/trade-chart";
import { AIPredictionPanel } from "@/components/ai-prediction-panel";
import { TradeHistory } from "@/components/trade-history";
import type { Trade, Prediction } from "@/lib/types";
import { addTrade, closeTrade, RootState } from "@/lib/redux/store";

export default function Home() {
  const dispatch = useDispatch();
  const trades = useSelector((state: RootState) => state.trades.trades);
  const [selectedPair, setSelectedPair] = React.useState("BTC/USDT");

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
    dispatch(addTrade(newTrade));
  };

  const handleCloseTrade = (tradeId: string) => {
    // Simulate a random profit or loss outcome
    const tradeToClose = trades.find(t => t.id === tradeId);
    if (!tradeToClose) return;

    const outcome = Math.random() > 0.5 ? "profit" : "loss";
    const pnl =
      outcome === "profit"
        ? (tradeToClose.takeProfit - tradeToClose.entryPrice) * tradeToClose.lotSize
        : (tradeToClose.stopLoss - tradeToClose.entryPrice) * tradeToClose.lotSize;
    
    dispatch(closeTrade({ tradeId, pnl: parseFloat(pnl.toFixed(2)) }));
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4">
            <TradeChart selectedPair={selectedPair} onPairChange={setSelectedPair} />
            <TradeHistory trades={trades} onCloseTrade={handleCloseTrade} />
          </div>
          <AIPredictionPanel 
            key={selectedPair} 
            onExecuteTrade={handleExecuteTrade} 
            selectedPair={selectedPair}
          />
        </div>
      </main>
    </div>
  );
}
